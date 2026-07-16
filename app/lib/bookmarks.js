"use client";

// 찜(북마크) 저장소. 로그인 없이 브라우저 localStorage에 저장합니다.
// 정책 객체 전체를 저장해서, '내 찜' 페이지에서 다시 불러올 수 있게 합니다.
import { useSyncExternalStore } from "react";

const KEY = "youthmoa:bookmarks";
const EMPTY = [];
const listeners = new Set();
let cache; // 파싱된 배열 캐시 (getSnapshot이 안정된 참조를 반환하도록)

function readStorage() {
  if (typeof window === "undefined") return EMPTY;
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return EMPTY;
  }
}

function ensureCache() {
  if (cache === undefined) cache = readStorage();
  return cache;
}

function write(next) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* 저장 실패는 무시 (용량 초과 등) */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb) {
  listeners.add(cb);
  const onStorage = (e) => {
    if (e.key === KEY) {
      cache = readStorage();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function toggleBookmark(policy) {
  const arr = ensureCache();
  const exists = arr.some((p) => p.id === policy.id);
  write(exists ? arr.filter((p) => p.id !== policy.id) : [...arr, policy]);
}

// 전체 찜 목록 (컴포넌트에서 구독)
export function useBookmarks() {
  return useSyncExternalStore(subscribe, ensureCache, () => EMPTY);
}

// 특정 정책이 찜되었는지
export function useIsBookmarked(id) {
  const list = useBookmarks();
  return list.some((p) => p.id === id);
}
