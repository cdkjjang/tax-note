import type { Metadata } from "next";
import CalcGuides from "@/components/CalcGuides";
import NextStep from "@/components/NextStep";
import RelatedTools from "@/components/RelatedTools";
import Link from "next/link";
import YearEndCalculator from "@/components/YearEndCalculator";
import AdSlot from "@/components/AdSlot";
import CalcNotes from "@/components/CalcNotes";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "연말정산 환급 계산기 — 총급여·공제로 환급액 미리보기",
  description:
    "총급여와 부양가족, 신용카드·연금저축·의료비 등 공제만 넣으면 연말정산 환급금 또는 추가납부 예상액을 바로 계산합니다. 2026년 기준 간이 계산기.",
  alternates: { canonical: "/calc/year-end" },
};

const faq = [
  {
    q: "연말정산 환급금은 어떻게 결정되나요?",
    a: "1년치 실제 세금(결정세액)을 계산해, 매달 미리 낸 세금(기납부세액)과 비교합니다. 미리 낸 것이 많으면 환급, 적으면 추가납부입니다. 결정세액은 소득공제와 세액공제를 얼마나 받았는지에 따라 줄어듭니다.",
  },
  {
    q: "기납부세액은 어디서 보나요?",
    a: "근로소득 원천징수영수증이나 매월 급여명세서의 '소득세' 합계입니다. 잘 모르면 비워 두세요. 그러면 환급액 대신 예상 결정세액(1년치 소득세)만 표시됩니다.",
  },
  {
    q: "이 계산기와 홈택스 결과가 다를 수 있나요?",
    a: "네. 이 계산기는 대표 공제(인적·4대보험·신용카드·연금계좌·보험료·의료비·기부금)만 반영한 간이 추정입니다. 자녀·주택자금·월세·교육비 세액공제와 신용카드 결제수단별 공제율은 반영하지 않아, 정확한 값은 홈택스 연말정산 미리보기에서 확인해야 합니다.",
  },
  {
    q: "연금저축을 넣으면 정말 환급이 늘어나나요?",
    a: "연금저축과 IRP 납입액은 연 최대 900만원까지 12~15%를 세액공제합니다. 총급여 5,500만원 이하는 15%, 초과는 12%입니다. 900만원을 넣으면 최대 135만원의 세금이 줄어 그만큼 환급이 늘어납니다.",
  },
];

export default function YearEndPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: faq.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      // 검색결과에 "사이트명 > 계산기명" 경로가 표시되도록 한다.
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "연말정산 환급 계산기" },
        ],
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="mb-2 text-2xl font-extrabold">연말정산 환급 계산기</h1>
      <p className="mb-6 text-muted">
        총급여와 부양가족, 그리고 아는 공제 항목만 넣으면 올해 연말정산에서
        돌려받을지 더 낼지, 대략의 금액을 미리 확인할 수 있습니다.
      </p>
      <YearEndCalculator />

      <NextStep calc="/calc/year-end" />

      <AdSlot slot="year-end-below-tool" />

      <section className="mt-10 space-y-4 text-[15px] leading-relaxed">
        <h2 className="text-xl font-bold">환급과 추가납부는 이렇게 갈립니다</h2>
        <p>
          연말정산은 1년 동안 미리 낸 세금과 실제 세금을 맞추는 정산입니다. 회사가
          매달 떼는 소득세는 간이세액표에 따른 임시 금액이라, 연말에 실제 세금을
          계산해 차액을 돌려주거나(환급) 더 걷습니다(추가납부). 그래서 &lsquo;세금이
          늘었다&rsquo;가 아니라 &lsquo;미리 낸 게 많았나 적었나&rsquo;의 문제입니다.
        </p>
        <p>
          실제 세금을 줄이는 것은 공제입니다. 신용카드 사용액(총급여 25% 초과분),
          연금저축·IRP, 의료비(총급여 3% 초과분), 기부금, 보장성보험료 등이
          대표적입니다. 같은 연봉이라도 이런 공제를 챙긴 사람이 더 많이 돌려받습니다.
          이 계산기로 항목을 하나씩 넣어보면, 어떤 공제가 내 세금을 얼마나 줄이는지
          눈으로 확인할 수 있습니다.
        </p>

        <h2 className="mt-8 text-xl font-bold">자주 묻는 질문</h2>
        <dl className="space-y-4">
          {faq.map(({ q, a }) => (
            <div
              key={q}
              className="rounded-xl border border-border-soft bg-card p-4 shadow-sm"
            >
              <dt className="font-bold">
                <span className="text-accent">Q.</span> {q}
              </dt>
              <dd className="mt-2 text-muted">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <CalcNotes
        updated="2026-08-02"
        basis={[
          {
            law: "소득세법 제47조 (근로소득공제)",
            detail:
              "총급여 구간에 따라 정해진 산식으로 공제액을 계산하며 한도는 2,000만원입니다. 총급여에서 이 공제를 빼면 근로소득금액이 됩니다.",
          },
          {
            law: "소득세법 제50조·제52조 (인적공제·특별소득공제)",
            detail:
              "기본공제는 본인과 부양가족 1명당 150만원입니다. 여기에 국민연금 등 연금보험료 공제와 건강·고용보험료 공제가 소득공제로 들어갑니다.",
          },
          {
            law: "조세특례제한법 제126조의2 (신용카드 등 사용금액 소득공제)",
            detail:
              "총급여의 25%를 초과한 사용액부터 공제가 시작됩니다. 결제 수단에 따라 공제율이 다르며(신용카드 15%, 체크카드·현금영수증 30% 등), 이 계산기는 대표율 15%로 추정합니다.",
          },
          {
            law: "소득세법 제59조·제59조의3·제59조의4 (세액공제)",
            detail:
              "산출세액에서 근로소득세액공제, 연금계좌 세액공제, 보장성보험료, 의료비, 기부금 세액공제를 뺍니다. 의료비는 총급여의 3%를 초과한 금액부터 대상이 됩니다.",
          },
        ]}
        note="자녀 세액공제, 주택자금·월세 세액공제, 교육비 공제, 신용카드 결제 수단별 세분화는 반영하지 않은 간이 추정입니다. 실제 환급액은 국세청 연말정산 미리보기나 회사 정산 결과로 확인하세요. 소득 정보는 서버로 전송되지 않고 브라우저 안에서만 계산됩니다."
        examples={[
          {
            title: "총급여 5,000만원 · 부양가족 본인 1명 · 기납부세액 200만원 · 카드 2,000만원 · 연금저축 300만원 · 보험료 100만원 · 의료비 200만원",
            steps: [
              "근로소득공제를 빼서 근로소득금액 37,750,000원",
              "보험료 소득공제 4,702,039원 + 인적공제 1,500,000원",
              "카드 공제: 총급여의 25%(1,250만원)를 넘는 750만원의 15% = 1,125,000원",
              "과세표준 = 30,422,961원 → 산출세액 3,303,440원",
              "세액공제 합계 1,305,000원 (근로 660,000 + 연금 450,000 + 보험 120,000 + 의료 75,000)",
              "결정세액 = 3,303,440 − 1,305,000 = 1,998,440원",
              "기납부세액 2,000,000원과 비교",
            ],
            result: "소득세 1,560원 환급 + 지방소득세 150원 환급",
          },
          {
            title: "카드 공제가 왜 750만원분만 잡히는지",
            steps: [
              "총급여 5,000만원의 25% = 12,500,000원 (문턱)",
              "실제 사용액 20,000,000원 − 문턱 12,500,000원 = 7,500,000원",
              "이 초과분에만 공제율을 적용합니다",
            ],
            result:
              "카드를 2,000만원 썼어도 공제 대상은 750만원 — 문턱을 못 넘으면 공제가 0입니다",
          },
        ]}
        pitfalls={[
          {
            heading: "카드 공제는 총급여의 25%를 넘겨야 시작됩니다",
            body:
              "연봉이 높을수록 문턱도 높아집니다. 총급여 5,000만원이면 1,250만원을 넘게 써야 그때부터 공제가 붙습니다. 문턱 근처라면 연말에 결제 수단을 조정할 여지가 있습니다.",
          },
          {
            heading: "의료비는 총급여의 3%를 넘어야 합니다",
            body:
              "총급여 5,000만원이면 150만원을 넘는 의료비부터 공제 대상입니다. 그래서 맞벌이 부부는 소득이 낮은 쪽으로 의료비를 몰면 문턱이 낮아져 유리한 경우가 있습니다.",
          },
          {
            heading: "환급은 '더 낸 세금을 돌려받는 것'입니다",
            body:
              "연말정산은 보너스가 아니라 1년간 미리 낸 세금과 실제 세금을 맞추는 절차입니다. 환급이 많다는 것은 그만큼 매달 많이 떼였다는 뜻이고, 추가납부는 적게 떼였다는 뜻입니다.",
          },
          {
            heading: "부양가족은 중복으로 올릴 수 없습니다",
            body:
              "형제가 각각 같은 부모님을 부양가족으로 올리면 나중에 문제가 됩니다. 누가 받을지 미리 정하고, 일반적으로 세율이 높은 쪽이 받으면 절세 효과가 큽니다.",
          },
        ]}
        sources={[
          { label: "국세청 홈택스", href: "https://www.hometax.go.kr" },
          { label: "국세청 연말정산 종합안내", href: "https://www.nts.go.kr" },
          { label: "국가법령정보센터", href: "https://www.law.go.kr" },
        ]}
      />

      <section className="mt-10 rounded-2xl border border-border-soft bg-card p-5">
        <h2 className="mb-3 font-bold">함께 확인하세요</h2>
        <ul className="space-y-2 text-[15px]">
          <li>
            <Link href="/guide/year-end-settlement-guide" className="text-accent underline-offset-4 hover:underline">
              연말정산 완벽 가이드 → 환급 원리와 놓치기 쉬운 공제
            </Link>
          </li>
          <li>
            <Link href="/guide/deduction-vs-credit" className="text-accent underline-offset-4 hover:underline">
              소득공제 vs 세액공제 → 무엇이 더 유리한가
            </Link>
          </li>
          <li>
            <Link href="/calc/income-tax" className="text-accent underline-offset-4 hover:underline">
              종합소득세 계산기 → 부업·프리랜서 소득이 있다면
            </Link>
          </li>
        </ul>
      </section>
      <CalcGuides calcHref="/calc/year-end" />
      <RelatedTools calc="/calc/year-end" />
    </div>
  );
}
