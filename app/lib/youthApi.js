// 온통청년(한국고용정보원) 청년정책 오픈API 연동 모듈.
import { zipToRegion } from "./regionUtils";

const BASE_URL = "https://www.youthcenter.go.kr/go/ythip/getPlcy";

// "20260707 ~ 20260731" 또는 "20260731" 형태에서 마감일(끝 날짜)을 뽑습니다.
// 상시/수시 등 날짜가 없으면 null을 반환합니다.
function parseDeadline(aplyYmd) {
  if (!aplyYmd || typeof aplyYmd !== "string") return null;
  const dates = aplyYmd.match(/\d{8}/g);
  if (!dates || dates.length === 0) return null;
  const end = dates[dates.length - 1]; // 범위면 끝 날짜
  return `${end.slice(0, 4)}-${end.slice(4, 6)}-${end.slice(6, 8)}`;
}

// 연령 표시 문자열을 만듭니다.
function ageLabel(minAge, maxAge, lmtYn) {
  const min = Number(minAge);
  const max = Number(maxAge);
  if (lmtYn === "Y") return "연령 무관";
  if (!min && !max) return "연령 무관";
  if (min && max) return `만 ${min}~${max}세`;
  if (max) return `만 ${max}세 이하`;
  if (min) return `만 ${min}세 이상`;
  return "연령 무관";
}

// "20260629 ~ 20260715" → "2026.06.29 ~ 2026.07.15" (날짜가 아닌 텍스트는 그대로)
function formatApplyPeriod(text) {
  if (!text) return "";
  return text.replace(
    /(\d{4})(\d{2})(\d{2})/g,
    (_, y, m, d) => `${y}.${m}.${d}`
  );
}

function firstNonEmpty(...vals) {
  for (const v of vals) {
    if (v && String(v).trim()) return String(v).trim();
  }
  return "";
}

// API 원본 레코드 → 화면에서 쓰는 정책 객체로 변환.
export function mapPolicy(raw) {
  const { regions, label } = zipToRegion(raw.zipCd);
  return {
    id: raw.plcyNo,
    title: firstNonEmpty(raw.plcyNm) || "제목 없음",
    category: firstNonEmpty(raw.lclsfNm, raw.plcyKywdNm) || "기타",
    organization: firstNonEmpty(raw.sprvsnInstCdNm, raw.operInstCdNm, raw.rgtrInstCdNm),
    region: label,
    regions, // 매칭용 시·도 배열 ([] 이면 전국)
    summary: firstNonEmpty(raw.plcyExplnCn, raw.plcySprtCn),
    support: firstNonEmpty(raw.plcySprtCn, raw.plcyExplnCn),
    ageRange: ageLabel(raw.sprtTrgtMinAge, raw.sprtTrgtMaxAge, raw.sprtTrgtAgeLmtYn),
    minAge: raw.sprtTrgtMinAge ? Number(raw.sprtTrgtMinAge) : null,
    maxAge: raw.sprtTrgtMaxAge ? Number(raw.sprtTrgtMaxAge) : null,
    ageLimitYn: raw.sprtTrgtAgeLmtYn || "N",
    target: firstNonEmpty(raw.addAplyQlfcCndCn, raw.ptcpPrpTrgtCn, raw.etcMttrCn),
    deadline: parseDeadline(raw.aplyYmd),
    applyPeriod: formatApplyPeriod(firstNonEmpty(raw.aplyYmd)),
    applyUrl: firstNonEmpty(raw.aplyUrlAddr, raw.refUrlAddr1) || "https://www.youthcenter.go.kr/",
    howToApply: firstNonEmpty(raw.plcyAplyMthdCn),
    documentsText: firstNonEmpty(raw.sbmsnDcmntCn),
  };
}

// 청년정책 목록을 가져옵니다. 실패 시 예외를 던집니다.
export async function fetchPolicies({ pageNum = 1, pageSize = 60 } = {}) {
  const key = process.env.YOUTH_API_KEY;
  if (!key) throw new Error("YOUTH_API_KEY 환경변수가 없습니다.");

  const url = `${BASE_URL}?apiKeyNm=${key}&pageNum=${pageNum}&pageSize=${pageSize}&rtnType=json`;
  const res = await fetch(url, {
    // 하루 1회 자동 갱신 (86400초). 이걸로 '자동 갱신' 단계도 함께 처리됩니다.
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`API 응답 오류: ${res.status}`);

  const data = await res.json();
  const list = data?.result?.youthPolicyList;
  if (!Array.isArray(list)) throw new Error("예상치 못한 API 응답 형식");

  return list.map(mapPolicy);
}

// 전체 청년정책 개수를 가져옵니다. (메인 화면 신뢰 통계용) 실패 시 null.
export async function fetchPolicyCount() {
  const key = process.env.YOUTH_API_KEY;
  if (!key) return null;
  try {
    const url = `${BASE_URL}?apiKeyNm=${key}&pageNum=1&pageSize=1&rtnType=json`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.result?.pagging?.totCount ?? null;
  } catch {
    return null;
  }
}

// 사이트맵용: 정책 id와 수정일만 가볍게 가져옵니다. 실패 시 빈 배열.
export async function fetchPolicyRefs({ pageSize = 500 } = {}) {
  const key = process.env.YOUTH_API_KEY;
  if (!key) return [];
  try {
    const url = `${BASE_URL}?apiKeyNm=${key}&pageNum=1&pageSize=${pageSize}&rtnType=json`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data = await res.json();
    const list = data?.result?.youthPolicyList;
    if (!Array.isArray(list)) return [];
    return list
      .filter((r) => r.plcyNo)
      .map((r) => ({
        id: r.plcyNo,
        lastModified: r.lastMdfcnDt || r.frstRegDt || null,
      }));
  } catch {
    return [];
  }
}

// 특정 정책 하나를 plcyNo로 가져옵니다. 없으면 null.
export async function fetchPolicyByNo(plcyNo) {
  const key = process.env.YOUTH_API_KEY;
  if (!key) throw new Error("YOUTH_API_KEY 환경변수가 없습니다.");

  const url = `${BASE_URL}?apiKeyNm=${key}&pageNum=1&pageSize=1&rtnType=json&plcyNo=${encodeURIComponent(
    plcyNo
  )}`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`API 응답 오류: ${res.status}`);

  const data = await res.json();
  const list = data?.result?.youthPolicyList;
  if (!Array.isArray(list) || list.length === 0) return null;
  return mapPolicy(list[0]);
}
