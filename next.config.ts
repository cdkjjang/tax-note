import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 보안 헤더 — 콘텐츠나 광고 동작에는 영향을 주지 않는다.
  // HSTS와 HTTPS 리다이렉트는 Vercel이 처리하므로 여기서는 세 가지만 둔다.
  // X-Frame-Options는 SAMEORIGIN — 광고는 우리 페이지 '안에' 들어오는
  // iframe이라 이 헤더의 영향을 받지 않는다.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // 이 사이트는 카메라·마이크·위치·결제를 쓰지 않는다. 명시적으로 꺼 두면
          // 광고 iframe을 포함한 하위 프레임에서도 요청할 수 없다.
          // 애드센스가 쓰는 기능이 아니라 광고 게재에 영향이 없다.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },

  // 2026-09-06 가이드 통합으로 사라진 슬러그 → 흡수한 글로 301.
  //
  // permanent: true는 308로 나가고 구글은 301과 같게 처리한다.
  // **이 목록을 지우지 말 것.** 지우는 순간 옛 URL이 404가 된다.
  //
  // 아래 두 건은 다른 노트로 보낸다. 같은 주제를 두 노트가 나눠 갖고 있었고
  // 그쪽이 그 주제의 본거지다. 이런 노트 간 중복이 애드센스 재반려의 원인 중
  // 하나였다(워크스페이스 CLAUDE.md 8장).
  //
  // ⚠️ 반대로 **급여노트가 이 노트로 보내는 301도 있다**
  //    (salary/year-end-settlement → year-end-settlement-guide).
  //    year-end-settlement-guide 슬러그를 바꾸면 그쪽이 404가 된다.
  async redirects() {
    const merged: Record<string, string> = {
      // → 연말정산 완벽 가이드 (원리 + 그해 달라진 점)
      "year-end-2026-changes": "/guide/year-end-settlement-guide",
      // → 종합소득세 신고 기초 (3.3% 환급까지)
      "freelancer-33-refund": "/guide/income-tax-guide",
      // → 부가가치세와 사업자등록
      "when-register-business": "/guide/vat-guide",
      // → 증여세 (공제 한도 + 생활비의 경계)
      "family-living-expenses": "/guide/gift-tax-guide",

      // 노트 간 중복 해소 — 그 주제의 본거지로 보낸다
      "car-tax-deduction": "https://car.lifebanjang.com/guide/car-tax-annual",
      "property-tax-guide":
        "https://budongsan.lifebanjang.com/guide/property-tax-schedule",
    };

    return Object.entries(merged).map(([from, to]) => ({
      source: `/guide/${from}`,
      destination: to,
      permanent: true,
    }));
  },
};

export default nextConfig;
