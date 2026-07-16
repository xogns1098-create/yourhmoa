import Link from "next/link";
import { getDday, formatDate } from "../lib/policyUtils";
import BookmarkButton from "./BookmarkButton";

// 정책 카드 (목록·맞춤결과 공용).
// matchReasons: 맞춤 찾기에서 "왜 추천되는지" 사유 배열 (선택)
export default function PolicyCard({ policy: p, matchReasons }) {
  const dday = getDday(p.deadline);
  return (
    <li className="policy-card">
      <div className="card-top">
        <span className="cat">{p.category}</span>
        <div className="card-top-right">
          <span
            className={
              "dday" +
              (dday.urgent ? " dday-urgent" : "") +
              (dday.closed ? " dday-closed" : "")
            }
          >
            {dday.label}
          </span>
          <BookmarkButton policy={p} />
        </div>
      </div>
      <h3>{p.title}</h3>

      {p.benefit && (
        <p className="benefit">
          <span className="benefit-icon" aria-hidden>
            💰
          </span>
          <span className="benefit-text">{p.benefit}</span>
        </p>
      )}

      <p className="summary">{p.plain || p.summary}</p>

      {matchReasons && matchReasons.length > 0 && (
        <ul className="match-reasons">
          {matchReasons.map((r) => (
            <li key={r}>✓ {r}</li>
          ))}
        </ul>
      )}

      <dl className="meta">
        <div>
          <dt>대상</dt>
          <dd>{p.ageRange}</dd>
        </div>
        <div>
          <dt>지역</dt>
          <dd>{p.region}</dd>
        </div>
        <div>
          <dt>주관</dt>
          <dd>{p.organization}</dd>
        </div>
        <div>
          <dt>마감</dt>
          <dd>{formatDate(p.deadline)}</dd>
        </div>
      </dl>
      <Link className="apply" href={`/policy/${p.id}`}>
        신청방법 보기 →
      </Link>
    </li>
  );
}
