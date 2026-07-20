import type { Metadata } from "next";
import Link from "next/link";
import YearEndCalculator from "@/components/YearEndCalculator";
import AdSlot from "@/components/AdSlot";

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
      <h1 className="mb-2 text-2xl font-extrabold">연말정산 환급 계산기</h1>
      <p className="mb-6 text-muted">
        총급여와 부양가족, 그리고 아는 공제 항목만 넣으면 올해 연말정산에서
        돌려받을지 더 낼지, 대략의 금액을 미리 확인할 수 있습니다.
      </p>
      <YearEndCalculator />

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
    </div>
  );
}
