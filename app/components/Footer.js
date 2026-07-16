import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-title">청년모아</span>
          <p className="footer-desc">
            전국 청년 지원정책·지원금 공고를 한곳에 모아 매일 최신으로 정리합니다.
          </p>
        </div>

        <nav className="footer-nav" aria-label="사이트 메뉴">
          <Link href="/find">정책 찾기</Link>
          <Link href="/about">사이트 소개</Link>
          <Link href="/privacy">개인정보처리방침</Link>
          <Link href="/terms">이용약관</Link>
        </nav>
      </div>

      <div className="footer-bottom">
        <p>
          데이터 출처: 온통청년(한국고용정보원) 공식 오픈API ·{" "}
          <a
            href="https://www.youthcenter.go.kr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            youthcenter.go.kr
          </a>
        </p>
        <p className="footer-note">
          ※ 청년모아는 정책정보를 모아 안내하는 서비스로, 실제 신청 자격·마감·내용은
          각 주관기관의 공식 공고를 반드시 확인하시기 바랍니다.
        </p>
        <p className="footer-copy">© 2026 청년모아. All rights reserved.</p>
      </div>
    </footer>
  );
}
