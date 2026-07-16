import Link from "next/link";
import { notFound } from "next/navigation";
import { getPolicyById } from "../../data/samplePolicies";
import { getDday, formatDate } from "../../lib/policyUtils";
import { fetchPolicyByNo } from "../../lib/youthApi";

// 정책 하나를 가져옵니다. API 우선, 실패/없으면 샘플 데이터로 대체.
async function getPolicy(id) {
  try {
    const policy = await fetchPolicyByNo(id);
    if (policy) return policy;
  } catch (e) {
    console.error("정책 상세 API 호출 실패:", e.message);
  }
  return getPolicyById(id) || null;
}

// 정책마다 검색엔진에 노출될 제목·설명을 지정합니다. (SEO)
export async function generateMetadata({ params }) {
  const { id } = await params;
  const policy = await getPolicy(id);
  if (!policy) {
    return { title: "정책을 찾을 수 없습니다 | 청년모아" };
  }
  return {
    title: `${policy.title} | 청년모아`,
    description: (policy.summary || "").slice(0, 150),
  };
}

export default async function PolicyDetailPage({ params }) {
  const { id } = await params;
  const policy = await getPolicy(id);

  if (!policy) {
    notFound();
  }

  const dday = getDday(policy.deadline);

  return (
    <main id="main-content" className="detail-page">
      <Link href="/" className="back-link">
        ← 목록으로
      </Link>

      <div className="detail-head">
        <div className="detail-tags">
          <span className="cat">{policy.category}</span>
          <span
            className={
              "dday" +
              (dday.urgent ? " dday-urgent" : "") +
              (dday.closed ? " dday-closed" : "")
            }
          >
            {dday.label}
          </span>
        </div>
        <h1>{policy.title}</h1>
        {policy.plain && (
          <p className="detail-plain">
            <span className="detail-plain-label" aria-hidden>
              💬 한마디로
            </span>
            {policy.plain}
          </p>
        )}
        {policy.summary && <p className="detail-summary">{policy.summary}</p>}
      </div>

      {policy.benefit && (
        <div className="detail-benefit">
          <span className="detail-benefit-label">핵심 혜택</span>
          <span className="detail-benefit-value">
            <span aria-hidden>💰</span> {policy.benefit}
          </span>
        </div>
      )}

      <dl className="detail-meta">
        <div>
          <dt>연령</dt>
          <dd>{policy.ageRange}</dd>
        </div>
        <div>
          <dt>지역</dt>
          <dd>{policy.region}</dd>
        </div>
        <div>
          <dt>주관 기관</dt>
          <dd>{policy.organization || "-"}</dd>
        </div>
        <div>
          <dt>신청 기간</dt>
          <dd>{policy.applyPeriod || formatDate(policy.deadline)}</dd>
        </div>
      </dl>

      {policy.target && (
        <section className="detail-block">
          <h2>지원 대상</h2>
          <p className="pre-line">{policy.target}</p>
        </section>
      )}

      {policy.support && (
        <section className="detail-block">
          <h2>지원 내용</h2>
          <p className="pre-line">{policy.support}</p>
        </section>
      )}

      {(policy.steps?.length > 0 || policy.howToApply) && (
        <section className="detail-block">
          <h2>신청 방법</h2>
          {policy.steps && policy.steps.length > 0 ? (
            <ol className="steps">
              {policy.steps.map((step, i) => (
                <li key={i}>
                  <span className="step-num" aria-hidden>
                    {i + 1}
                  </span>
                  <span className="step-text">{step}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="pre-line">{policy.howToApply}</p>
          )}
        </section>
      )}

      {policy.documents && policy.documents.length > 0 && (
        <section className="detail-block">
          <h2>준비 서류</h2>
          <ul className="doc-list">
            {policy.documents.map((doc, i) => (
              <li key={i}>
                <span className="doc-check" aria-hidden>
                  📄
                </span>
                {doc}
              </li>
            ))}
          </ul>
          <p className="doc-note">
            ※ 서류는 정책·상황에 따라 달라질 수 있으니 신청 전 공식 공고에서 확인하세요.
          </p>
        </section>
      )}

      {policy.documentsText && (
        <section className="detail-block">
          <h2>준비 서류</h2>
          <p className="pre-line">{policy.documentsText}</p>
        </section>
      )}

      {policy.contact && (
        <section className="detail-block">
          <h2>문의처</h2>
          <p>{policy.contact}</p>
        </section>
      )}

      <a
        className="detail-cta"
        href={policy.applyUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        공식 공고 원문에서 신청하기 →
      </a>

      <p className="detail-disclaimer">
        ※ 본 정보는 참고용입니다. 실제 신청 자격·기간·내용은 변경될 수 있으니 신청 전
        반드시 주관기관의 공식 공고를 확인해 주세요.
      </p>
    </main>
  );
}
