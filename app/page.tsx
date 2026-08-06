import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import HomeNotes from "@/components/HomeNotes";
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
      <HomeNotes
        siteName={SITE_NAME}
        updated="2026-08-02"
        intro="세금은 신고 기한이 지나면 가산세가 붙습니다. 미리 계산해 두면 자금 계획을 세울 수 있고, 빠뜨린 공제도 찾을 수 있습니다."
        scenarios={[
          {
            situation: "연말정산에서 환급인지 추가납부인지 궁금할 때",
            action:
              "카드 공제는 총급여의 25%를 넘긴 금액부터, 의료비는 3%를 넘긴 금액부터 시작합니다. 문턱을 못 넘으면 아무리 써도 공제가 0이므로 미리 확인해 두면 12월에 조정할 여지가 있습니다.",
            href: "/calc/year-end",
            label: "연말정산 환급액 계산하기",
          },
          {
            situation: "프리랜서·부업 소득으로 5월 신고를 앞두고 있을 때",
            action:
              "3.3%를 뗀 것은 세금 정산이 끝난 것이 아니라 미리 걷어간 것입니다. 1년치를 합산해 누진세율로 다시 계산하므로 추가납부가 나올 수도, 환급이 나올 수도 있습니다.",
            href: "/calc/income-tax",
            label: "종합소득세 계산하기",
          },
          {
            situation: "견적서에 부가세를 포함할지 별도로 할지 정할 때",
            action:
              "1,000만원이 별도면 받을 금액은 1,100만원, 포함이면 공급가액은 약 909만원입니다. 계약서에 명시하지 않으면 나중에 다투게 되는 가장 흔한 지점입니다.",
            href: "/calc/vat",
            label: "부가가치세 환산하기",
          },
          {
            situation: "가족에게 돈이나 재산을 주고받을 때",
            action:
              "증여재산공제는 10년 단위로 합산됩니다. 이미 공제 한도를 썼다면 이번 증여에는 적용되지 않습니다. 혼인·출산과 관련해서는 추가 공제가 별도로 있습니다.",
            href: "/calc/gift-tax",
            label: "증여세 계산하기",
          },
        ]}
        faq={[
          {
            q: "회사에서 연말정산을 했는데 5월에 또 신고해야 하나요?",
            a: "근로소득 외에 사업소득이나 기타소득이 있으면 합산해 5월에 종합소득세를 신고해야 합니다. 연말정산은 근로소득만 정리한 것이라 그것으로 끝나지 않습니다.",
          },
          {
            q: "계산 결과와 실제 세액이 다를 수 있나요?",
            a: "간이 추정입니다. 연말정산 계산기는 자녀·주택자금·월세·교육비 세액공제를 반영하지 않았고, 카드 공제율도 대표값을 씁니다. 정확한 금액은 홈택스 연말정산 미리보기나 회사 정산 결과로 확인하세요.",
          },
          {
            q: "지난해에 놓친 공제를 지금 받을 수 있나요?",
            a: "경정청구로 법정신고기한 후 5년 이내라면 바로잡을 수 있습니다. 월세 세액공제처럼 몰라서 못 받은 항목이 있다면 확인해 볼 가치가 있습니다.",
          },
          {
            q: "입력한 소득 정보가 저장되나요?",
            a: "저장되지 않습니다. 모든 계산은 브라우저 안에서 이루어지며 서버로 전송되지 않습니다.",
          },
        ]}
        maintained={[
          "종합소득 기본세율과 누진공제액 (소득세법 제55조)",
          "근로소득공제·근로소득세액공제 산식 (소득세법 제47조·제59조)",
          "증여재산공제 한도와 증여세율 (상속세 및 증여세법 제53조·제56조)",
          "신용카드 등 사용금액 소득공제율과 한도 (조세특례제한법)",
          "부가가치세율과 간이과세 기준금액",
        ]}
      />

      <AdSlot slot="home-bottom" />
    </div>
  );
}
