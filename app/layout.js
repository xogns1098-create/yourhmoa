import Script from "next/script";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, GA_ID } from "./lib/siteConfig";

const TITLE = "청년모아 | 내게 맞는 청년정책을 한눈에";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | 청년모아",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "청년정책",
    "청년 지원금",
    "청년 지원사업",
    "청년월세",
    "청년내일채움공제",
    "온통청년",
    "청년 정책 모아보기",
  ],
  alternates: { canonical: "/" },
  verification: {
    google: "gibR1c0pzUIlBDbfCrTSAAnsmb3k_Hd4e1AY-tW3srk",
    other: {
      "naver-site-verification": "54eb14592b86bed359f20cad7bbdf3033b364a21",
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <a href="#main-content" className="skip-link">
          본문 바로가기
        </a>
        <Header />
        {children}
        <Footer />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8407480096414341"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
