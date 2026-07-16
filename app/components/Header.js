import Link from "next/link";
import SavedLink from "./SavedLink";

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand" aria-label="청년모아 홈">
          <span className="brand-mark" aria-hidden>
            {/* 로고: 청년(사람) + 모아(하트/모임) 느낌의 심플 마크 */}
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="9" fill="var(--brand)" />
              <circle cx="16" cy="12.5" r="4" fill="#fff" />
              <path
                d="M8 23c0-4.4 3.6-7 8-7s8 2.6 8 7"
                stroke="#fff"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="brand-text">
            청년<em>모아</em>
          </span>
        </Link>

        <nav className="site-nav" aria-label="주요 메뉴">
          <Link href="/find">정책 찾기</Link>
          <SavedLink />
          <Link href="/about">소개</Link>
        </nav>
      </div>
    </header>
  );
}
