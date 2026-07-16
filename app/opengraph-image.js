import { ImageResponse } from "next/og";

export const alt = "청년모아 - 내게 맞는 청년정책을 한눈에";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 필요한 글자만 담은 한글 서브셋 폰트를 구글폰트에서 불러옵니다. (용량 최소)
const SUBSET_TEXT =
  "청년모아내게 맞는정책을한눈에.전국지원금·매일자동업데이트";

async function loadKoreanFont(text) {
  const url = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@800&text=${encodeURIComponent(
    text
  )}`;
  // UA를 지정하지 않으면 구글이 TTF(truetype)를 내려줍니다 (Satori가 지원).
  const css = await (await fetch(url)).text();
  const src = css.match(/src: url\((.+?)\) format\('(truetype|opentype)'\)/);
  if (!src) throw new Error("폰트 URL 파싱 실패");
  const fontRes = await fetch(src[1]);
  if (!fontRes.ok) throw new Error("폰트 다운로드 실패");
  return fontRes.arrayBuffer();
}

export default async function Image() {
  let fonts = [];
  try {
    const data = await loadKoreanFont(SUBSET_TEXT);
    fonts = [{ name: "NotoKR", data, style: "normal", weight: 800 }];
  } catch {
    fonts = []; // 폰트 실패 시에도 이미지 자체는 생성 (한글은 깨질 수 있음)
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "84px",
          background:
            "linear-gradient(135deg, #e7f0ff 0%, #f4f8ff 55%, #fff2e2 100%)",
          fontFamily: "NotoKR",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "34px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "#2f6bff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "40px",
              fontWeight: 800,
            }}
          >
            청
          </div>
          <div style={{ fontSize: "44px", fontWeight: 800, color: "#16203a" }}>
            청년모아
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "82px",
            fontWeight: 800,
            color: "#16203a",
            lineHeight: 1.18,
            letterSpacing: "-3px",
          }}
        >
          내게 맞는 청년정책을
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "82px",
            fontWeight: 800,
            color: "#2f6bff",
            lineHeight: 1.18,
            letterSpacing: "-3px",
          }}
        >
          한눈에.
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "34px",
            color: "#46506b",
            marginTop: "34px",
          }}
        >
          전국 청년 지원정책·지원금을 매일 자동 업데이트
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
