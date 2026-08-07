import type { Metadata } from "next";
import Link from "next/link";
import VatCalculator from "@/components/VatCalculator";
import AdSlot from "@/components/AdSlot";
import CalcNotes from "@/components/CalcNotes";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "부가가치세 계산기 — 공급가액·세액·합계 10% 자동 계산",
  description:
    "공급가액에서 부가세를 더하거나, 부가세 포함 합계에서 공급가액을 역산하거나, 세액에서 금액을 구합니다. 세율 10% 일반과세 기준 부가가치세 계산기.",
  alternates: { canonical: "/calc/vat" },
};

const faq = [
  {
    q: "부가세 포함 금액에서 공급가액을 빼는 방법은?",
    a: "합계를 1.1로 나누면 공급가액, 나머지가 부가세입니다. 예를 들어 11만원(부가세 포함)이면 공급가액 10만원, 부가세 1만원입니다. 계산기에서 '합계에서 역산'을 선택하고 총액을 넣으면 됩니다.",
  },
  {
    q: "간이과세자도 이 계산기로 되나요?",
    a: "이 계산기는 일반과세(세율 10%) 기준입니다. 간이과세자는 업종별 부가가치율(15~40%)을 매출세액에 곱해 실제 납부세액이 훨씬 낮습니다. 간이과세 납부세액은 홈택스나 세무 상담으로 확인하세요.",
  },
  {
    q: "납부할 부가세는 매출세액 전부인가요?",
    a: "아닙니다. 실제 납부세액은 '매출세액 − 매입세액'입니다. 물건·비품을 사면서 낸 부가세(매입세액)를 세금계산서로 공제받으면 그만큼 낼 세금이 줄고, 매입이 더 크면 환급받습니다.",
  },
];

export default function VatPage() {
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
          { "@type": "ListItem", position: 2, name: "부가가치세 계산기" },
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
      <h1 className="mb-2 text-2xl font-extrabold">부가가치세 계산기</h1>
      <p className="mb-6 text-muted">
        공급가액에서 세액을 더하거나, 부가세 포함 합계에서 거꾸로 공급가액을
        뽑아내거나, 세액만 알 때 금액을 구합니다. 세율 10% 기준입니다.
      </p>
      <VatCalculator />

      <AdSlot slot="vat-below-tool" />

      <section className="mt-10 space-y-4 text-[15px] leading-relaxed">
        <h2 className="text-xl font-bold">공급가액·부가세·합계, 헷갈리지 않기</h2>
        <p>
          부가가치세는 공급가액의 10%입니다. 공급가액이 100만원이면 부가세는
          10만원, 소비자가 실제 내는 합계(공급대가)는 110만원입니다. 반대로 부가세가
          포함된 110만원에서 공급가액을 구하려면 1.1로 나눠 100만원, 나머지 10만원이
          부가세입니다.
        </p>
        <p>
          세금계산서를 발행하거나 견적을 낼 때, 표시된 금액이 부가세 포함인지
          별도인지에 따라 실제 주고받는 돈이 10% 차이 납니다. 이 계산기로 세 방향을
          바로 확인하면 견적·정산에서 실수를 줄일 수 있습니다. 사업자의 실제
          납부세액은 여기서 나온 매출세액에서 매입세액을 뺀 금액입니다.
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
            law: "부가가치세법 제30조 (세율)",
            detail:
              "부가가치세율은 10%입니다. 공급가액에 10%를 곱한 금액이 세액이고, 공급가액과 세액을 합한 것이 공급대가(소비자가 실제로 내는 금액)입니다.",
          },
          {
            law: "공급가액 ↔ 공급대가 환산",
            detail:
              "공급가액에서 세액을 구할 때는 ×10%, 공급대가에서 공급가액을 뽑을 때는 ÷1.1을 합니다. 세액만 알 때는 ×10을 하면 공급가액이 나옵니다.",
          },
          {
            law: "부가가치세법 제49조 (확정신고)",
            detail:
              "일반과세자는 1기(1~6월)를 7월에, 2기(7~12월)를 다음 해 1월에 신고합니다. 법인은 분기마다 예정신고가 추가됩니다.",
          },
          {
            law: "부가가치세법 제61조 (간이과세)",
            detail:
              "직전 연도 공급대가가 기준금액 미만인 개인사업자는 간이과세를 적용받습니다. 업종별 부가가치율을 곱해 세액을 계산하므로 일반과세와 산식이 다릅니다.",
          },
        ]}
        note="이 계산기는 일반과세 10% 기준의 환산 도구입니다. 간이과세자의 세액은 업종별 부가가치율이 적용되어 다르게 계산되며, 매입세액 공제 방식도 다릅니다. 실제 신고 세액은 매출세액에서 매입세액을 뺀 금액입니다."
        examples={[
          {
            title: "공급가액 1,000만원에 부가세를 더하면",
            steps: [
              "공급가액 = 10,000,000원",
              "부가가치세 = 10,000,000 × 10% = 1,000,000원",
              "공급대가(합계) = 11,000,000원",
            ],
            result: "세금계산서에는 공급가액 1,000만원 · 세액 100만원으로 기재됩니다",
          },
          {
            title: "1,100만원을 받았는데 부가세가 포함된 금액이라면",
            steps: [
              "공급대가 = 11,000,000원",
              "공급가액 = 11,000,000 ÷ 1.1 = 10,000,000원",
              "부가가치세 = 11,000,000 − 10,000,000 = 1,000,000원",
            ],
            result:
              "포함인지 별도인지에 따라 100만원이 갈립니다 — 견적서에 반드시 명시하세요",
          },
        ]}
        pitfalls={[
          {
            heading: "'부가세 별도'인지 '포함'인지 먼저 확인하세요",
            body:
              "견적과 계약에서 가장 흔한 분쟁 지점입니다. 1,000만원이 별도면 실제 받을 금액은 1,100만원이고, 포함이면 공급가액은 약 909만원입니다. 계약서에 명시하지 않으면 나중에 다투게 됩니다.",
          },
          {
            heading: "받은 부가세는 내 돈이 아닙니다",
            body:
              "부가가치세는 소비자에게 받아 국가에 대신 내는 세금입니다. 통장에 들어왔다고 매출로 생각하고 써 버리면 신고 시기에 자금이 부족해집니다. 따로 떼어 두는 편이 안전합니다.",
          },
          {
            heading: "매입세액 공제를 받으려면 증빙이 필요합니다",
            body:
              "낼 세금은 매출세액에서 매입세액을 뺀 금액입니다. 세금계산서, 사업용 신용카드 매출전표, 현금영수증(지출증빙)을 갖춰야 공제받을 수 있습니다. 간이영수증만으로는 공제가 어렵습니다.",
          },
          {
            heading: "면세 대상 거래도 있습니다",
            body:
              "기초 생필품, 의료·교육 용역 등 일부 재화와 용역은 부가가치세가 면제됩니다. 면세사업자는 부가세 신고 대신 사업장현황신고를 합니다. 본인 업종이 어디에 해당하는지 확인하세요.",
          },
        ]}
        sources={[
          { label: "국세청 홈택스", href: "https://www.hometax.go.kr" },
          { label: "국세청 부가가치세 안내", href: "https://www.nts.go.kr" },
          { label: "국가법령정보센터", href: "https://www.law.go.kr" },
        ]}
      />

      <section className="mt-10 rounded-2xl border border-border-soft bg-card p-5">
        <h2 className="mb-3 font-bold">함께 확인하세요</h2>
        <ul className="space-y-2 text-[15px]">
          <li>
            <Link href="/guide/vat-guide" className="text-accent underline-offset-4 hover:underline">
              부가가치세 기초 → 일반과세와 간이과세의 차이
            </Link>
          </li>
          <li>
            <Link href="/calc/income-tax" className="text-accent underline-offset-4 hover:underline">
              종합소득세 계산기 → 사업 소득세도 함께
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
