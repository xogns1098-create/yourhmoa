"use client";

import { useIsBookmarked, toggleBookmark } from "../lib/bookmarks";

export default function BookmarkButton({ policy }) {
  const saved = useIsBookmarked(policy.id);
  return (
    <button
      type="button"
      className={"bookmark-btn" + (saved ? " saved" : "")}
      aria-pressed={saved}
      aria-label={saved ? "찜 해제하기" : "찜하기"}
      title={saved ? "찜 해제" : "찜하기"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(policy);
      }}
    >
      <span aria-hidden>{saved ? "♥" : "♡"}</span>
    </button>
  );
}
