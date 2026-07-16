"use client";

import Link from "next/link";
import { useBookmarks } from "../lib/bookmarks";
import { deadlineRank } from "../lib/policyUtils";
import PolicyCard from "../components/PolicyCard";

export default function SavedPage() {
  const bookmarks = useBookmarks();
  const sorted = [...bookmarks].sort(
    (a, b) => deadlineRank(a.deadline) - deadlineRank(b.deadline)
  );

  return (
    <main id="main-content" className="saved-page">
      <div className="list-head">
        <h1>내가 찜한 청년정책</h1>
        <span className="demo-note">
          {bookmarks.length > 0
            ? `총 ${bookmarks.length}건 저장됨`
            : "아직 찜한 정책이 없어요"}
        </span>
      </div>

      {sorted.length === 0 ? (
        <div className="empty">
          <p className="empty-emoji" aria-hidden>
            🔖
          </p>
          <p className="empty-title">찜한 정책이 여기 모여요</p>
          <p className="empty-sub">
            마음에 드는 정책의 하트(♡)를 누르면 여기에 저장돼요. 마감 전에 다시 와서
            확인하세요.
          </p>
          <Link href="/" className="empty-cta">
            정책 찾으러 가기 →
          </Link>
        </div>
      ) : (
        <ul className="policy-grid">
          {sorted.map((p) => (
            <PolicyCard key={p.id} policy={p} />
          ))}
        </ul>
      )}
    </main>
  );
}
