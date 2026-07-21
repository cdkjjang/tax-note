import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import Link from "next/link";
import { guides } from "@/lib/guides";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const TOOLS = [
  {
    href: "/calc/year-end",
    title: "연말정산 환급 계산기",
    desc: "총급여와 공제만 넣으면 환급·추가납부 예상액을 바로",
    badge: "연말정산",
  },
  {
    href: "/calc/income-tax",
    title: "종합소득세 계산기",
    desc: "프리랜서·사업자 소득금액으로 세액과 5월 정산 가늠",
    badge: "종합소득세",
  },
  {
    href: "/calc/vat",
    title: "부가가치세 계산기",
    desc: "공급가액·세액·합계를 어느 방향으로든 10% 계산",
    badge: "부가세",
  },
  {
    href: "/calc/gift-tax",
    title: "증여세 계산기",
    desc: "관계별 증여재산공제와 세율로 납부세액을 바로",
    badge: "증여세",
  },
];

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "ko",
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="py-6 text-center sm:py-10">
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
          복잡한 세금,
          <br className="sm:hidden" /> 직접 계산해 보세요
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          연말정산 환급금부터 종합소득세·부가가치세·증여세까지, 흩어진 세금 계산을
          한곳에서 30초 안에 끝내세요. 회원가입도, 개인정보 입력도 없습니다.
        </p>
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm transition-all hover:border-accent hover:shadow-md"
          >
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent-strong">
              {tool.badge}
            </span>
            <h2 className="mt-3 text-lg font-bold leading-snug">{tool.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {tool.desc}
            </p>
          </Link>
        ))}
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-bold">세금 가이드</h2>
          <Link href="/guide" className="text-sm text-accent hover:underline">
            전체 보기 →
          </Link>
        </div>
        <ul className="space-y-3">
          {guides.slice(0, 5).map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guide/${g.slug}`}
                className="block rounded-xl border border-border-soft bg-card p-4 shadow-sm transition-all hover:border-accent"
              >
                <p className="font-bold leading-snug">{g.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted">
                  {g.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 space-y-4 text-[15px] leading-relaxed">
        <h2 className="text-xl font-bold">
          세금은 &lsquo;근거를 알고 내는 것&rsquo;이 절세의 시작입니다
        </h2>
        <p>
          연말정산 환급, 프리랜서의 5월 종합소득세 신고, 사업자의 부가세, 부모가
          자녀에게 하는 증여 — 세금이 걸린 순간마다 &lsquo;얼마 나올까&rsquo;가
          가장 먼저 궁금해집니다. 하지만 세법은 구간과 공제가 얽혀 있어, 근거를
          모른 채 고지서만 받아드는 경우가 많습니다.
        </p>
        <p>
          {SITE_NAME}는 소득세법·상속세및증여세법·부가가치세법 등 공개된 세법
          기준으로 만든 계산기를 제공합니다. 세액이 어떤 구조로 나오는지, 어떤
          공제가 세금을 줄이는지 직접 확인하세요. 입력한 숫자는 브라우저 안에서만
          계산되고 서버로 전송되지 않습니다.
        </p>
      </section>
      <AdSlot slot="home-bottom" />
    </div>
  );
}
