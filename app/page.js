import Link from "next/link";
import { fetchPolicyCount } from "./lib/youthApi";
import { TOPICS, REGIONS } from "./lib/landingConfig";

const FEATURES = [
  {
    icon: "🎯",
    title: "맞춤 찾기",
    desc: "나이·지역·관심분야만 고르면, 수백 개 공고 중 내가 받을 수 있는 정책만 골라드려요.",
  },
  {
    icon: "💬",
    title: "쉬운 말 설명",
    desc: "‘비과세’, ‘구직촉진수당’ 같은 어려운 정책 용어를 한마디로 쉽게 풀어드려요.",
  },
  {
    icon: "🪜",
    title: "신청까지 안내",
    desc: "혜택만 알려주고 끝? 신청 방법을 단계별로, 준비 서류까지 짚어드려요.",
  },
  {
    icon: "🔖",
    title: "찜하고 다시 보기",
    desc: "마음에 드는 정책은 찜해두고, 마감 전에 다시 와서 놓치지 않고 챙기세요.",
  },
];

export default async function Home() {
  const count = await fetchPolicyCount();
  const countLabel = count ? `${Number(count).toLocaleString()}개` : "전국";

  return (
    <main id="main-content" className="landing">
      {/* 히어로 (밝은 톤 + 미래 도약 배경) */}
      <section className="landing-hero">
        <div className="hero-content">
        <span className="badge">전국 청년정책 모아보기 · 매일 업데이트</span>
        <h1>
          흩어진 청년정책,
          <br />
          <em>내게 맞는 것만</em> 딱.
        </h1>
        <p className="landing-sub">
          주거·취업·창업·금융까지. 복잡한 정부 공고를 뒤질 필요 없이,
          <br className="br-desktop" /> 몇 번의 클릭으로 내가 받을 수 있는 청년 지원을
          찾아보세요.
        </p>

        <div className="landing-cta-row">
          <Link href="/find#finder" className="cta-primary">
            🎯 내게 맞는 정책 찾기
          </Link>
          <Link href="/find#browse" className="cta-secondary">
            전체 정책 둘러보기
          </Link>
        </div>

        <p className="landing-trust">
          <strong>{countLabel}</strong>의 청년정책을 온통청년 공식 데이터로 매일 자동
          업데이트합니다.
        </p>
        </div>
      </section>

      {/* 강점 */}
      <section className="landing-features" aria-label="청년모아의 강점">
        <h2 className="section-title">청년모아는 이게 달라요</h2>
        <ul className="feature-grid">
          {FEATURES.map((f) => (
            <li key={f.title} className="feature-card">
              <span className="feature-icon" aria-hidden>
                {f.icon}
              </span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 비교 */}
      <section className="landing-compare">
        <h2 className="section-title">왜 청년모아일까요?</h2>
        <div className="compare-row">
          <div className="compare-col compare-them">
            <span className="compare-tag">기존 방식</span>
            <ul>
              <li>부처·지자체 사이트를 하나하나 확인</li>
              <li>어려운 공고문을 직접 해석</li>
              <li>내가 받을 수 있는지 스스로 판단</li>
              <li>마감일을 놓치기 일쑤</li>
            </ul>
          </div>
          <div className="compare-col compare-us">
            <span className="compare-tag">청년모아</span>
            <ul>
              <li>전국 청년정책을 한곳에 모아서</li>
              <li>쉬운 말로 핵심만 요약</li>
              <li>내 조건에 맞는 정책만 자동 선별</li>
              <li>마감 임박 정책을 먼저 알려줌</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 주제·지역별 허브 (검색 유입 랜딩으로 연결) */}
      <section className="landing-hub" aria-label="주제·지역별 청년정책">
        <h2 className="section-title">주제별로 찾아보기</h2>
        <div className="hub-chips">
          {TOPICS.map((t) => (
            <Link key={t.slug} href={`/topic/${t.slug}`} className="hub-chip">
              <span className="hub-chip-emoji" aria-hidden>
                {t.emoji}
              </span>
              {t.label}
            </Link>
          ))}
        </div>

        <h2 className="section-title hub-region-title">지역별로 찾아보기</h2>
        <div className="hub-chips">
          {REGIONS.map((r) => (
            <Link key={r.slug} href={`/region/${r.slug}`} className="hub-chip hub-chip-sm">
              {r.name}
            </Link>
          ))}
        </div>
      </section>

      {/* 마무리 CTA */}
      <section className="landing-final">
        <h2>지금 내가 받을 수 있는 청년정책, 확인해 볼까요?</h2>
        <Link href="/find#finder" className="cta-primary cta-lg">
          내게 맞는 정책 찾기 →
        </Link>
      </section>
    </main>
  );
}
