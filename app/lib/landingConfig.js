// 검색 유입용 랜딩 페이지(주제별·지역별) 설정과 데이터 로더.
// 얇은 중복 페이지가 되지 않도록, 각 페이지는 사람이 쓴 안내문(intro)과
// 실제 데이터로 필터된 정책 목록을 함께 제공합니다.

import { samplePolicies } from "../data/samplePolicies";
import { fetchPolicies } from "./youthApi";
import { getDday } from "./policyUtils";

// 정책의 제목·요약·대상·분야를 하나의 검색 대상 문자열로 합칩니다.
function haystack(p) {
  return `${p.title || ""} ${p.summary || ""} ${p.target || ""} ${p.category || ""}`;
}

// ---------- 주제별 랜딩 ----------
// match: 이 주제에 해당하는 정책인지 판단하는 함수.
export const TOPICS = [
  {
    slug: "housing",
    label: "주거·월세",
    emoji: "🏠",
    title: "청년 월세·주거 지원 총정리 | 청년모아",
    h1: "청년 월세·주거 지원 정책 모아보기",
    description:
      "청년 월세 지원, 전세보증금 대출, 임차보증금 이자 지원 등 전국 청년 주거 정책을 한곳에 모았습니다. 조건과 신청 방법을 쉽게 확인하세요.",
    intro:
      "자취를 시작하거나 독립을 준비하는 청년에게 월세와 보증금은 가장 큰 부담입니다. 정부와 지자체는 청년 월세 특별지원, 전세자금 대출 이자 지원, 임차보증금 대출처럼 주거비를 덜어주는 제도를 운영하고 있어요. 아래에서 지금 신청할 수 있는 주거 지원을 모아 보고, 나이·지역 조건에 맞는지 확인해 보세요.",
    keywords: ["청년 월세 지원", "청년 주거 지원", "청년 전세자금 대출", "청년 임차보증금"],
    match: (p) =>
      /주거/.test(p.category) ||
      /월세|주거|전세|임차|보증금|기숙사|주택|매입임대|셰어/.test(haystack(p)),
  },
  {
    slug: "jobs",
    label: "취업·일자리",
    emoji: "💼",
    title: "청년 취업·일자리 지원금 총정리 | 청년모아",
    h1: "청년 취업·일자리 지원 정책 모아보기",
    description:
      "청년 취업 지원금, 일경험·인턴, 국민취업지원제도 등 전국 청년 일자리 정책을 한곳에 모았습니다. 구직 중인 청년을 위한 지원을 확인하세요.",
    intro:
      "취업을 준비하는 청년을 위한 지원은 생각보다 많습니다. 구직활동을 지원하는 수당, 실제 업무를 경험하는 일경험·인턴 프로그램, 면접 정장 대여처럼 취업 과정 곳곳을 돕는 제도가 있어요. 아래 정책들을 살펴보고 지금 지원할 수 있는 일자리 지원을 챙겨 보세요.",
    keywords: ["청년 취업 지원금", "청년 일자리", "국민취업지원제도", "청년 일경험"],
    match: (p) =>
      /일자리|취업/.test(p.category) ||
      /취업|일자리|채용|인턴|일경험|구직|고용|면접|취준/.test(haystack(p)),
  },
  {
    slug: "startup",
    label: "창업",
    emoji: "🚀",
    title: "청년 창업 지원 총정리 | 청년모아",
    h1: "청년 창업 지원 정책 모아보기",
    description:
      "청년 창업 지원금, 창업 공간 입주, 예비창업패키지 등 전국 청년 창업 정책을 한곳에 모았습니다. 창업을 준비하는 청년을 위한 지원을 확인하세요.",
    intro:
      "아이디어는 있는데 자금과 공간이 막막한 청년 창업가를 위한 지원이 있습니다. 사업화 자금, 창업 공간 입주, 멘토링과 교육까지 창업 단계별로 도움을 받을 수 있어요. 아래에서 지금 모집 중인 청년 창업 지원을 확인해 보세요.",
    keywords: ["청년 창업 지원", "예비창업패키지", "청년 창업 공간", "스타트업 지원"],
    match: (p) => /창업|스타트업|사업화|예비창업|벤처/.test(haystack(p)),
  },
  {
    slug: "savings",
    label: "목돈·자산형성",
    emoji: "💰",
    title: "청년 목돈·자산형성 지원 총정리 | 청년모아",
    h1: "청년 목돈·자산형성 지원 정책 모아보기",
    description:
      "청년내일저축계좌, 청년도약계좌, 자산형성 통장 등 목돈 마련을 돕는 전국 청년 자산형성 정책을 한곳에 모았습니다.",
    intro:
      "적은 돈이라도 꾸준히 모으면 정부와 지자체가 곱절로 보태주는 자산형성 제도가 있습니다. 청년내일저축계좌, 청년도약계좌, 지역별 자산형성 통장처럼 몇 년 뒤 목돈으로 돌려받는 상품이 대표적이에요. 아래에서 내 조건에 맞는 자산형성 지원을 찾아보세요.",
    keywords: ["청년내일저축계좌", "청년도약계좌", "청년 자산형성", "청년 통장"],
    match: (p) => /자산형성|통장|저축|목돈|내일저축|도약계좌|적금|공제|청약/.test(haystack(p)),
  },
  {
    slug: "education",
    label: "교육·자격증",
    emoji: "📚",
    title: "청년 교육·자격증 지원 총정리 | 청년모아",
    h1: "청년 교육·자격증 지원 정책 모아보기",
    description:
      "청년 자격증 응시료 지원, 직업훈련, 부트캠프, 취업 아카데미 등 전국 청년 교육·훈련 정책을 한곳에 모았습니다.",
    intro:
      "역량을 키우고 싶은 청년을 위한 교육·훈련 지원이 있습니다. 자격증 응시료 지원, 국비 직업훈련, 실무 부트캠프처럼 배우면서 취업까지 이어지는 프로그램이 많아요. 아래에서 지금 신청할 수 있는 교육 지원을 확인해 보세요.",
    keywords: ["청년 자격증 지원", "청년 직업훈련", "국비 지원 교육", "청년 부트캠프"],
    match: (p) =>
      /교육|직업훈련/.test(p.category) ||
      /자격증|교육|훈련|부트캠프|아카데미|장학|학자금|응시료|멘토링/.test(haystack(p)),
  },
  {
    slug: "welfare",
    label: "생활·복지·문화",
    emoji: "🎫",
    title: "청년 생활·복지·문화 지원 총정리 | 청년모아",
    h1: "청년 생활·복지·문화 지원 정책 모아보기",
    description:
      "청년 교통비 환급, 마음건강 상담, 문화·여가 바우처 등 일상을 돕는 전국 청년 복지·문화 정책을 한곳에 모았습니다.",
    intro:
      "취업이나 주거 말고도 청년의 일상을 돕는 지원이 있습니다. 대중교통비 환급, 마음건강 상담, 문화·여가 바우처처럼 생활에 밀착한 제도들이에요. 아래에서 놓치기 쉬운 생활·복지·문화 지원을 챙겨 보세요.",
    keywords: ["청년 교통비 지원", "K-패스", "청년 마음건강", "청년 문화 바우처"],
    match: (p) =>
      /금융·복지·문화|복지|문화/.test(p.category) ||
      /교통비|건강|의료|바우처|마음|문화|여가|생활|K-?패스/.test(haystack(p)),
  },
];

export function getTopic(slug) {
  return TOPICS.find((t) => t.slug === slug) || null;
}

// ---------- 지역별 랜딩 ----------
export const REGIONS = [
  { slug: "seoul", name: "서울" },
  { slug: "busan", name: "부산" },
  { slug: "daegu", name: "대구" },
  { slug: "incheon", name: "인천" },
  { slug: "gwangju", name: "광주" },
  { slug: "daejeon", name: "대전" },
  { slug: "ulsan", name: "울산" },
  { slug: "sejong", name: "세종" },
  { slug: "gyeonggi", name: "경기" },
  { slug: "gangwon", name: "강원" },
  { slug: "chungbuk", name: "충북" },
  { slug: "chungnam", name: "충남" },
  { slug: "jeonbuk", name: "전북" },
  { slug: "jeonnam", name: "전남" },
  { slug: "gyeongbuk", name: "경북" },
  { slug: "gyeongnam", name: "경남" },
  { slug: "jeju", name: "제주" },
];

export function getRegion(slug) {
  return REGIONS.find((r) => r.slug === slug) || null;
}

// 정책이 특정 시·도 '전용'인지(전국 정책이 아닌, 그 지역 대상인지).
export function isRegionSpecific(policy, regionName) {
  const list = policy.regions ?? (policy.region ? [policy.region] : []);
  return list.includes(regionName);
}

// 전국 어디서나 신청 가능한 정책인지.
export function isNationwide(policy) {
  const list = policy.regions ?? (policy.region ? [policy.region] : []);
  return list.length === 0 || list.includes("전국") || policy.region === "전국";
}

// 랜딩용 정책을 넉넉히 가져옵니다. API 우선, 실패 시 샘플 데이터로 대체.
// 마감된 정책은 제외합니다.
export async function getLandingPolicies() {
  let policies = samplePolicies;
  let live = false;
  try {
    const fetched = await fetchPolicies({ pageNum: 1, pageSize: 500 });
    if (fetched.length > 0) {
      policies = fetched;
      live = true;
    }
  } catch (e) {
    console.error("랜딩 정책 API 호출 실패, 샘플로 대체:", e.message);
  }
  const open = policies.filter((p) => !getDday(p.deadline).closed);
  return { policies: open, live };
}
