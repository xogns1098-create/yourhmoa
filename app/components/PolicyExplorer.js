"use client";

import { useMemo, useState } from "react";
import { getDday, getUniqueValues, deadlineRank } from "../lib/policyUtils";
import PolicyCard from "./PolicyCard";

export default function PolicyExplorer({ policies }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체");
  const [region, setRegion] = useState("전체");
  const [sort, setSort] = useState("deadline"); // deadline | latest
  const [hideClosed, setHideClosed] = useState(true);

  const categories = useMemo(
    () => ["전체", ...getUniqueValues(policies, "category")],
    [policies]
  );
  const regions = useMemo(
    () => ["전체", ...getUniqueValues(policies, "region")],
    [policies]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = policies.filter((p) => {
      if (category !== "전체" && p.category !== category) return false;
      if (region !== "전체" && p.region !== region) return false;
      if (hideClosed && getDday(p.deadline).closed) return false;
      if (q) {
        const haystack = `${p.title} ${p.summary} ${p.organization} ${p.target}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    result = [...result].sort((a, b) => {
      if (sort === "deadline") {
        return deadlineRank(a.deadline) - deadlineRank(b.deadline);
      }
      // latest: plcyNo는 등록 시각 기반이라 역순이 최신순에 가깝습니다.
      return String(b.id).localeCompare(String(a.id));
    });

    return result;
  }, [policies, query, category, region, sort, hideClosed]);

  return (
    <section className="explorer">
      {/* 검색 */}
      <div className="search-bar">
        <span className="search-icon" aria-hidden>
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="정책명, 지원내용, 기관으로 검색 (예: 월세, 창업, 취업)"
          aria-label="청년정책 검색"
        />
        {query && (
          <button
            className="clear-btn"
            onClick={() => setQuery("")}
            aria-label="검색어 지우기"
          >
            ✕
          </button>
        )}
      </div>

      {/* 카테고리 칩 */}
      <div className="chip-row" role="group" aria-label="카테고리 필터">
        {categories.map((c) => (
          <button
            key={c}
            className={"chip" + (category === c ? " chip-active" : "")}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* 지역 + 정렬 + 옵션 */}
      <div className="control-row">
        <label className="select-wrap">
          <span>지역</span>
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>

        <label className="select-wrap">
          <span>정렬</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="deadline">마감 임박순</option>
            <option value="latest">최신 등록순</option>
          </select>
        </label>

        <label className="toggle">
          <input
            type="checkbox"
            checked={hideClosed}
            onChange={(e) => setHideClosed(e.target.checked)}
          />
          <span>마감된 정책 숨기기</span>
        </label>

        <span className="result-count">
          총 <strong>{filtered.length}</strong>건
        </span>
      </div>

      {/* 결과 */}
      {filtered.length === 0 ? (
        <div className="empty">
          <p className="empty-emoji" aria-hidden>
            🔎
          </p>
          <p className="empty-title">조건에 맞는 청년정책이 없어요</p>
          <p className="empty-sub">검색어나 필터를 바꿔서 다시 찾아보세요.</p>
        </div>
      ) : (
        <ul className="policy-grid">
          {filtered.map((p) => (
            <PolicyCard key={p.id} policy={p} />
          ))}
        </ul>
      )}
    </section>
  );
}
