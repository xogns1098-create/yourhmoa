"use client";

import Link from "next/link";
import { useBookmarks } from "../lib/bookmarks";

export default function SavedLink() {
  const bookmarks = useBookmarks();
  return (
    <Link href="/saved" className="nav-saved">
      <span aria-hidden>♥</span> 내 찜
      {bookmarks.length > 0 && (
        <span className="nav-saved-count">{bookmarks.length}</span>
      )}
    </Link>
  );
}
