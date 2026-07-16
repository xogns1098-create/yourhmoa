// zipCd 앞 2자리 → 시·도 이름 매핑.
// ⚠️ 온통청년 API는 표준 법정동 코드와 다른 자체 지역 코드를 사용합니다.
//    (특히 광주=12 로, 표준 법정동의 29와 다름 — 실제 응답 데이터로 검증함)
const SIDO_BY_PREFIX = {
  "11": "서울",
  "12": "광주", // 온통청년 자체 코드 (검증됨)
  "26": "부산",
  "27": "대구",
  "28": "인천",
  "29": "광주", // 표준 법정동 대비용 예비
  "30": "대전",
  "31": "울산",
  "36": "세종",
  "41": "경기",
  "42": "강원", // 구 코드
  "51": "강원", // 신 코드
  "43": "충북",
  "44": "충남",
  "45": "전북", // 구 코드
  "52": "전북", // 신 코드
  "46": "전남",
  "47": "경북",
  "48": "경남",
  "50": "제주",
};

// 전국 시·도 개수(세종 포함 17). 이 정도 커버하면 '전국'으로 간주.
const NATIONWIDE_THRESHOLD = 15;

// zipCd 문자열 → { regions: [시·도 이름...], label: 화면 표시용 }
export function zipToRegion(zipCd) {
  if (!zipCd || typeof zipCd !== "string") {
    return { regions: [], label: "전국" };
  }
  const sidos = new Set();
  for (const code of zipCd.split(",")) {
    const prefix = code.trim().slice(0, 2);
    const name = SIDO_BY_PREFIX[prefix];
    if (name) sidos.add(name);
  }
  const regions = Array.from(sidos);

  if (regions.length === 0 || regions.length >= NATIONWIDE_THRESHOLD) {
    return { regions: [], label: "전국" };
  }
  if (regions.length === 1) {
    return { regions, label: regions[0] };
  }
  if (regions.length <= 3) {
    return { regions, label: regions.join("·") };
  }
  return { regions, label: `${regions[0]} 외 ${regions.length - 1}곳` };
}
