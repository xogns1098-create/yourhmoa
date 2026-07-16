import { samplePolicies } from "../data/samplePolicies";
import { getDday } from "../lib/policyUtils";
import { fetchPolicies } from "../lib/youthApi";
import MatchFinder from "../components/MatchFinder";
import PolicyExplorer from "../components/PolicyExplorer";

export const metadata = {
  title: "청년정책 찾기 | 청년모아",
  description:
    "나이·지역·관심분야로 나에게 맞는 청년 지원정책을 찾아보세요. 전국 청년정책을 매일 최신으로 제공합니다.",
};

// 실제 청년정책을 API로 가져오고, 실패하면 샘플 데이터로 대체합니다.
async function getPolicies() {
  try {
    const policies = await fetchPolicies({ pageNum: 1, pageSize: 60 });
    if (policies.length > 0) return { policies, live: true };
  } catch (e) {
    console.error("청년정책 API 호출 실패, 샘플 데이터로 대체합니다:", e.message);
  }
  return { policies: samplePolicies, live: false };
}

export default async function FindPage() {
  const { policies, live } = await getPolicies();

  const openPolicies = policies.filter((p) => !getDday(p.deadline).closed);
  const openCount = openPolicies.length;
  const closingSoon = openPolicies.filter((p) => getDday(p.deadline).urgent).length;

  return (
    <main id="main-content" className="find-page">
      <div className="find-intro">
        <h1>청년정책 찾기</h1>
        <p>나이·지역·관심분야를 고르면 나에게 맞는 정책만 골라드려요.</p>
      </div>

      {closingSoon > 0 && (
        <a href="#browse" className="urgent-banner">
          <span className="urgent-banner-icon" aria-hidden>
            ⏰
          </span>
          <span>
            이번 주 마감되는 정책이 <strong>{closingSoon}건</strong> 있어요. 놓치기 전에
            확인하세요!
          </span>
          <span className="urgent-banner-arrow" aria-hidden>
            →
          </span>
        </a>
      )}

      <MatchFinder policies={policies} />

      <div className="list-head browse-head" id="browse">
        <h2>전체 청년정책 둘러보기</h2>
        <span className="demo-note">
          {live ? (
            <>
              현재 <strong>{openCount}건</strong> 모집 중 · 온통청년 실시간 연동
            </>
          ) : (
            <>
              현재 <strong>{openCount}건</strong> · 샘플 데이터 (API 일시 오류)
            </>
          )}
        </span>
      </div>

      <PolicyExplorer policies={policies} />
    </main>
  );
}
