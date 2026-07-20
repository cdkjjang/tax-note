// SNS 공유 시 표시되는 OG 이미지 — 빌드 시 정적 생성
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "세금노트 — 연말정산·종합소득세·부가세·증여세 계산기";

const TITLE = "복잡한 세금, 직접 계산";
const SUB = "연말정산 · 종합소득세 · 부가가치세 · 증여세";
const BRAND = "세금노트";

async function loadKoreanFont(text: string): Promise<ArrayBuffer> {
  const css = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(text)}`
    )
  ).text();
  const match = css.match(/src:\s*url\((.+?)\)\s*format\('(?:truetype|opentype|woff)'\)/);
  if (!match) throw new Error("OG 이미지용 폰트 URL을 찾지 못했습니다");
  return await (await fetch(match[1])).arrayBuffer();
}

export default async function OpengraphImage() {
  const font = await loadKoreanFont(TITLE + SUB + BRAND);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(135deg, #1e46a8 0%, #2f5fd0 60%, #4d7ae6 100%)",
          fontFamily: "NotoSansKR",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -2 }}>{TITLE}</div>
        <div style={{ marginTop: 28, fontSize: 30, opacity: 0.9 }}>{SUB}</div>
        <div
          style={{
            marginTop: 56,
            display: "flex",
            alignItems: "center",
            backgroundColor: "#ffffff",
            color: "#1e46a8",
            fontSize: 34,
            fontWeight: 700,
            padding: "14px 44px",
            borderRadius: 999,
          }}
        >
          {BRAND}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "NotoSansKR", data: font, weight: 700, style: "normal" }],
    }
  );
}
