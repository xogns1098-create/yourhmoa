// 사이트 절대 주소. 배포 후 실제 도메인이 정해지면
// Vercel 환경변수 NEXT_PUBLIC_SITE_URL 만 바꾸면 전체(sitemap/robots/OG)에 반영됩니다.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://youthmoa.co.kr"
).replace(/\/$/, "");

export const SITE_NAME = "청년모아";
export const SITE_DESCRIPTION =
  "전국의 청년 지원정책·지원금 공고를 한곳에 모아 매일 최신으로 정리합니다. 나이·지역·관심분야로 나에게 맞는 청년정책을 쉽게 찾아보세요.";

// Google Analytics 4 측정 ID (G-XXXXXXXXXX).
// Vercel 환경변수 NEXT_PUBLIC_GA_ID 에 넣으면 방문자 통계가 수집됩니다.
// 값이 없으면 추적 스크립트를 넣지 않습니다(로컬 개발 등).
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
