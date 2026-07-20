import type { Metadata } from "next";
import Link from "next/link";
import VatCalculator from "@/components/VatCalculator";
import AdSlot from "@/components/AdSlot";

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
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
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
