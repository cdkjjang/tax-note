import type { Metadata } from "next";
import Link from "next/link";
import GiftTaxCalculator from "@/components/GiftTaxCalculator";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "증여세 계산기 — 관계별 공제·세율로 납부세액 바로 확인",
  description:
    "증여액과 증여자와의 관계만 넣으면 증여재산공제와 세율(10~50%), 신고세액공제를 반영한 납부세액을 바로 계산합니다. 혼인·출산 공제까지 반영한 2026년 기준.",
  alternates: { canonical: "/calc/gift-tax" },
};

const faq = [
  {
    q: "성년 자녀에게 얼마까지 세금 없이 줄 수 있나요?",
    a: "직계존속이 성년 자녀에게 증여할 때 10년간 5,000만원까지 공제됩니다. 여기에 2024년 신설된 혼인·출산 공제 1억원을 더하면, 결혼·출산 시점에는 1억 5,000만원까지 증여세 없이 줄 수 있습니다.",
  },
  {
    q: "증여재산공제는 매번 받나요?",
    a: "10년 합산 기준입니다. 같은 증여자에게서 10년 안에 여러 번 받으면 합산해 한 번의 한도만 적용됩니다. 다만 10년이 지나면 한도가 새로 살아나므로, 10년 주기로 나눠 증여하면 세금을 줄일 수 있습니다.",
  },
  {
    q: "증여세는 언제까지 신고하나요?",
    a: "재산을 받은 사람이 증여일이 속한 달의 말일부터 3개월 이내에 신고·납부합니다. 기한 내 신고하면 산출세액의 3%를 신고세액공제로 깎아줍니다. 이 계산기는 신고세액공제를 반영한 금액입니다.",
  },
  {
    q: "조부모가 손자녀에게 주면 세금이 더 붙나요?",
    a: "네. 세대를 건너뛴 증여는 산출세액에 30%(미성년자에게 20억 초과 증여 시 40%)가 할증됩니다. 이 계산기는 할증을 반영하지 않으므로, 세대생략 증여라면 실제 세액이 더 큽니다.",
  },
];

export default function GiftTaxPage() {
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
      <h1 className="mb-2 text-2xl font-extrabold">증여세 계산기</h1>
      <p className="mb-6 text-muted">
        증여액과 증여자와의 관계만 넣으면 관계별 공제와 세율을 반영해 납부할
        증여세를 바로 알려드립니다. 혼인·출산 공제도 반영합니다.
      </p>
      <GiftTaxCalculator />

      <AdSlot slot="gift-tax-below-tool" />

      <section className="mt-10 space-y-4 text-[15px] leading-relaxed">
        <h2 className="text-xl font-bold">증여세, 공제 한도를 알면 줄어듭니다</h2>
        <p>
          증여세는 받은 금액에서 관계별 &lsquo;증여재산공제&rsquo;를 뺀
          과세표준에 10~50% 세율을 매깁니다. 배우자는 6억원, 성년 자녀는 5,000만원,
          미성년 자녀는 2,000만원이 공제 한도입니다. 이 한도 안이면 낼 세금이
          없습니다.
        </p>
        <p>
          핵심은 이 공제가 &lsquo;10년 합산&rsquo; 기준이라는 점입니다. 10년이
          지나면 한도가 새로 살아나므로, 미리 계획해 10년 주기로 나눠 증여하면
          같은 금액이라도 세금을 크게 줄일 수 있습니다. 2024년 신설된 혼인·출산
          공제(추가 1억원)까지 활용하면 절세 폭이 더 커집니다. 이 계산기로 관계와
          금액을 바꿔가며 세액이 어떻게 달라지는지 확인해 보세요.
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
            <Link href="/guide/gift-tax-guide" className="text-accent underline-offset-4 hover:underline">
              증여세 절세 → 10년 단위 공제 활용법
            </Link>
          </li>
          <li>
            <Link href="/guide/deduction-vs-credit" className="text-accent underline-offset-4 hover:underline">
              소득공제 vs 세액공제 → 세금 줄이는 원리
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
