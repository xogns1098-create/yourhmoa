// 정책 데이터 가공을 위한 공용 함수 모음.
// 서버/클라이언트 컴포넌트 양쪽에서 재사용합니다.

// 마감일까지 남은 일수(D-day)를 계산합니다.
// deadline 이 없으면(상시/수시 모집) 마감 개념이 없는 것으로 처리합니다.
export function getDday(deadline) {
  if (!deadline) {
    return { label: "상시모집", urgent: false, closed: false, diff: null, ongoing: true };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(deadline);
  end.setHours(0, 0, 0, 0);
  const diff = Math.round((end - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: "마감", urgent: false, closed: true, diff };
  if (diff === 0) return { label: "오늘 마감", urgent: true, closed: false, diff };
  return { label: `D-${diff}`, urgent: diff <= 7, closed: false, diff };
}

// 마감일 정렬용 값. 마감일 없는(상시) 정책은 맨 뒤로 보냅니다.
export function deadlineRank(deadline) {
  return deadline ? new Date(deadline).getTime() : Infinity;
}

export function formatDate(deadline) {
  if (!deadline) return "상시모집";
  const d = new Date(deadline);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

// 데이터에서 실제로 존재하는 값들만 뽑아 필터 목록을 만듭니다.
// (나중에 실제 API 데이터로 바뀌어도 필터가 자동으로 맞춰집니다.)
export function getUniqueValues(policies, key) {
  const values = policies.map((p) => p[key]).filter(Boolean);
  return Array.from(new Set(values));
}

// "만 19~34세", "만 39세 이하", "만 18세 이상" 같은 문자열에서 나이 범위를 추출합니다.
export function parseAgeRange(text) {
  if (!text) return { min: null, max: null };
  const nums = (text.match(/\d+/g) || []).map(Number);
  if (text.includes("~") && nums.length >= 2) {
    return { min: nums[0], max: nums[1] };
  }
  if (text.includes("이하") && nums.length >= 1) {
    return { min: null, max: nums[nums.length - 1] };
  }
  if (text.includes("이상") && nums.length >= 1) {
    return { min: nums[0], max: null };
  }
  if (nums.length >= 2) return { min: nums[0], max: nums[1] };
  return { min: null, max: null };
}

// 사용자 조건(나이/지역/관심분야)에 정책이 맞는지 판단하고, 맞는 사유를 돌려줍니다.
// 반환: { matched: boolean, reasons: string[] }
export function matchPolicy(policy, criteria) {
  const reasons = [];

  // 나이
  if (criteria.age != null && criteria.age !== "") {
    const age = Number(criteria.age);
    const { min, max } = parseAgeRange(policy.ageRange);
    const okMin = min == null || age >= min;
    const okMax = max == null || age <= max;
    if (!okMin || !okMax) {
      return { matched: false, reasons: [] };
    }
    reasons.push(`만 ${age}세 지원 대상`);
  }

  // 지역 (정책이 '전국'이거나, 내 지역을 포함하면 통과)
  if (criteria.region && criteria.region !== "전체") {
    // 실제 API 데이터는 regions 배열([]=전국), 샘플 데이터는 region 문자열을 씁니다.
    const regionList = policy.regions ?? (policy.region ? [policy.region] : []);
    const isNationwide =
      regionList.length === 0 || regionList.includes("전국") || policy.region === "전국";

    if (isNationwide) {
      reasons.push("전국 어디서나 신청 가능");
    } else if (regionList.includes(criteria.region)) {
      reasons.push(`${criteria.region} 거주자 대상`);
    } else {
      return { matched: false, reasons: [] };
    }
  }

  // 관심분야 (선택한 카테고리 중 하나에 해당하면 통과)
  if (criteria.categories && criteria.categories.length > 0) {
    if (!criteria.categories.includes(policy.category)) {
      return { matched: false, reasons: [] };
    }
    reasons.push(`관심분야: ${policy.category}`);
  }

  return { matched: true, reasons };
}
