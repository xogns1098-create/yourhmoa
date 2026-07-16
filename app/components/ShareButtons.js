"use client";

import { useEffect, useState } from "react";

// 카카오 JavaScript 키 (브라우저 공개 키 · 카카오 개발자 콘솔의 도메인 제한으로 보호됨)
const KAKAO_JS_KEY =
  process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "5b6601a760a2d41cff52d195d3546089";
const KAKAO_SDK_SRC = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";

export default function ShareButtons({ title, description, imageUrl }) {
  const [copied, setCopied] = useState(false);
  const [kakaoReady, setKakaoReady] = useState(false);

  // 카카오 JS 키가 있을 때만 SDK를 불러와 초기화합니다.
  useEffect(() => {
    if (!KAKAO_JS_KEY) return;
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) window.Kakao.init(KAKAO_JS_KEY);
      setKakaoReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = KAKAO_SDK_SRC;
    script.async = true;
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_JS_KEY);
      }
      setKakaoReady(true);
    };
    document.head.appendChild(script);
  }, []);

  function getUrl() {
    return typeof window !== "undefined" ? window.location.href : "";
  }

  function markCopied() {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function copyLink() {
    const url = getUrl();
    // 최신 브라우저: Clipboard API
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        markCopied();
        return;
      } catch {
        /* 아래 폴백으로 */
      }
    }
    // 폴백: 임시 textarea + execCommand (비보안/구형 환경 대응)
    try {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      markCopied();
    } catch {
      /* 최종 실패 시 무시 */
    }
  }

  async function shareGeneric() {
    const url = getUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url });
      } catch {
        /* 사용자가 취소 */
      }
    } else {
      copyLink();
    }
  }

  function shareKakao() {
    const url = getUrl();
    // 카카오 SDK가 준비됐으면 리치 카드로 공유
    if (kakaoReady && window.Kakao?.Share) {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title,
          description: description || "",
          imageUrl: imageUrl || "",
          link: { mobileWebUrl: url, webUrl: url },
        },
        buttons: [
          {
            title: "자세히 보기",
            link: { mobileWebUrl: url, webUrl: url },
          },
        ],
      });
    } else {
      // 키 미설정 시: 모바일이면 공유창(카카오톡 포함), 아니면 링크 복사
      shareGeneric();
    }
  }

  return (
    <div className="share-row">
      <span className="share-label">공유하기</span>
      <button type="button" className="share-btn share-kakao" onClick={shareKakao}>
        <span aria-hidden>💬</span> 카카오톡
      </button>
      <button type="button" className="share-btn" onClick={shareGeneric}>
        <span aria-hidden>🔗</span> 공유
      </button>
      <button type="button" className="share-btn" onClick={copyLink}>
        {copied ? "✅ 복사됨" : "📋 링크 복사"}
      </button>
    </div>
  );
}
