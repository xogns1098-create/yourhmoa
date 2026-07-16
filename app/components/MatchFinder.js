"use client";

import { useEffect, useMemo, useState } from "react";
import { matchPolicy, getUniqueValues, deadlineRank, getDday } from "../lib/policyUtils";
import PolicyCard from "./PolicyCard";

const CRITERIA_KEY = "youthmoa:criteria";

const REGIONS = [
  "전체",
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

export default function MatchFinder({ policies }) {
  const [age, setAge] = useState("");
  const [region, setRegion] = useState("전체");
  const [categories, setCategories] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [restored, setRestored] = useState(false);

  const categoryOptions = useMemo(
    () => getUniqueValues(policies, "category"),
    [policies]
  );

  // 다시 방문하면, 지난번 입력한 조건을 불러와 바로 맞춤 결과를 보여줍니다.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CRITERIA_KEY) || "null");
      if (saved && (saved.age || (saved.region && saved.region !== "전체"))) {
        setAge(saved.age || "");
        setRegion(saved.region || "전체");
        setCategories(Array.isArray(saved.categories) ? saved.categories : []);
        setSubmitted(true);
        setRestored(true);
      }
    } catch {
      /* 무시 */
    }
  }, []);

  const results = useMemo(() => {
    if (!submitted) return [];
    return policies
      .map((p) => ({ policy: p, ...matchPolicy(p, { age, region, categories }) }))
      .filter((r) => r.matched && !getDday(r.policy.deadline).closed) // 마감된 정책 제외
      .sort((a, b) => deadlineRank(a.policy.deadline) - deadlineRank(b.policy.deadline));
  }, [submitted, policies, age, region, categories]);

  function toggleCategory(c) {
    setCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setRestored(false);
    // 입력한 조건을 기억해 두었다가 다음 방문 때 자동으로 보여줍니다.
    try {
      localStorage.setItem(CRITERIA_KEY, JSON.stringify({ age, region, categories }));
    } catch {
      /* 무시 */
    }
  }

  function reset() {
    setSubmitted(false);
    setRestored(false);
    try {
      localStorage.removeItem(CRITERIA_KEY);
    } catch {
      /* 무시 */
    }
  }

  return (
    <section className="finder" id="finder">
      <div className="finder-head">
        <span className="finder-emoji" aria-hidden>
          🎯
        </span>
        <div>
          <h2>나에게 맞는 청년정책 찾기</h2>
          <p>몇 가지만 고르면, 내가 받을 수 있는 정책만 골라드려요.</p>
        </div>
      </div>

      <form className="finder-form" onSubmit={handleSubmit}>
        <div className="finder-row">
          <label className="finder-field">
            <span>내 나이</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              max="100"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="예: 27"
            />
          </label>

          <label className="finder-field">
            <span>거주 지역</span>
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r === "전체" ? "지역 선택 안 함" : r}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="finder-field">
          <span>관심 분야 (선택)</span>
          <div className="chip-row">
            {categoryOptions.map((c) => (
              <button
                type="button"
                key={c}
                className={"chip" + (categories.includes(c) ? " chip-active" : "")}
                onClick={() => toggleCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="finder-submit">
          내게 맞는 정책 찾기
        </button>
      </form>

      {submitted && (
        <div className="finder-results">
          {restored && (
            <p className="restored-note">
              🧠 지난번 입력한 조건으로 다시 보여드리고 있어요.
            </p>
          )}
          <div className="finder-results-head">
            <p>
              {age && <strong>만 {age}세</strong>}
              {region !== "전체" && <> · {region}</>} 회원님께 해당되는 정책{" "}
              <strong className="count">{results.length}건</strong>
            </p>
            <button className="reset-btn" onClick={reset}>
              조건 다시 선택
            </button>
          </div>

          {results.length === 0 ? (
            <div className="empty">
              <p className="empty-emoji" aria-hidden>
                🔎
              </p>
              <p className="empty-title">조건에 맞는 정책을 찾지 못했어요</p>
              <p className="empty-sub">
                관심 분야를 줄이거나 지역을 바꿔서 다시 찾아보세요.
              </p>
            </div>
          ) : (
            <ul className="policy-grid">
              {results.map((r) => (
                <PolicyCard
                  key={r.policy.id}
                  policy={r.policy}
                  matchReasons={r.reasons}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
