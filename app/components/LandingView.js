import Link from "next/link";
import PolicyCard from "./PolicyCard";

// 주제별·지역별 랜딩 페이지 공통 레이아웃 (서버 컴포넌트).
// - heading: h1 제목
// - intro: 안내 문단(사람이 쓴 설명)
// - primary: 메인 정책 목록 [{policy, matchReasons?}]
// - primaryLabel / secondary / secondaryLabel: 2그룹 구성 시(지역 페이지) 사용
// - related: 하단 내부 링크 [{href, label}] (SEO 내부 링크 + 탐색)
export default function LandingView({
  heading,
  intro,
  primary,
  primaryLabel,
  secondary,
  secondaryLabel,
  relatedTitle,
  related,
}) {
  const total = primary.length + (secondary ? secondary.length : 0);

  return (
    <main id="main-content" className="find-page landing-view">
      <Link href="/find" className="back-link">
        ← 청년정책 찾기
      </Link>

      <div className="find-intro">
        <h1>{heading}</h1>
        <p className="landing-view-intro">{intro}</p>
      </div>

      {total === 0 ? (
        <div className="empty">
          <p className="empty-emoji" aria-hidden>
            🔎
          </p>
          <p className="empty-title">지금 모집 중인 정책이 없어요</p>
          <p className="empty-sub">
            곧 새로운 공고가 올라올 수 있어요. <Link href="/find">전체 정책 둘러보기</Link>
          </p>
        </div>
      ) : (
        <>
          <section className="landing-group">
            {primaryLabel && (
              <div className="list-head">
                <h2>{primaryLabel}</h2>
                <span className="demo-note">
                  <strong>{primary.length}건</strong> 모집 중
                </span>
              </div>
            )}
            {primary.length > 0 ? (
              <ul className="policy-grid">
                {primary.map(({ policy }) => (
                  <PolicyCard key={policy.id} policy={policy} />
                ))}
              </ul>
            ) : (
              <p className="landing-empty-note">
                현재 이 지역 전용으로 모집 중인 정책은 없어요. 아래 전국 지원을 확인해 보세요.
              </p>
            )}
          </section>

          {secondary && secondary.length > 0 && (
            <section className="landing-group">
              <div className="list-head">
                <h2>{secondaryLabel}</h2>
                <span className="demo-note">
                  <strong>{secondary.length}건</strong> 모집 중
                </span>
              </div>
              <ul className="policy-grid">
                {secondary.map(({ policy }) => (
                  <PolicyCard key={policy.id} policy={policy} />
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      <section className="landing-cta-band">
        <p>내 나이·지역에 딱 맞는 정책만 골라 보고 싶다면?</p>
        <Link href="/find#finder" className="finder-submit">
          🎯 내게 맞는 정책 찾기
        </Link>
      </section>

      {related && related.length > 0 && (
        <nav className="landing-related" aria-label={relatedTitle}>
          <h2>{relatedTitle}</h2>
          <div className="chip-row">
            {related.map((r) => (
              <Link key={r.href} href={r.href} className="chip">
                {r.label}
              </Link>
            ))}
          </div>
        </nav>
      )}

      <p className="detail-disclaimer">
        ※ 본 정보는 참고용입니다. 실제 신청 자격·기간·내용은 변경될 수 있으니 신청 전 반드시
        주관기관의 공식 공고를 확인해 주세요.
      </p>
    </main>
  );
}
