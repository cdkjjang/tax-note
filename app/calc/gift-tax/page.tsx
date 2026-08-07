import type { Metadata } from "next";
import Link from "next/link";
import GiftTaxCalculator from "@/components/GiftTaxCalculator";
import AdSlot from "@/components/AdSlot";
import CalcNotes from "@/components/CalcNotes";
import { SITE_NAME, SITE_URL } from "@/lib/site";

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
          { "@type": "ListItem", position: 2, name: "증여세 계산기" },
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

      <CalcNotes
        updated="2026-08-02"
        basis={[
          {
            law: "상속세 및 증여세법 제53조 (증여재산공제)",
            detail:
              "배우자 6억원, 직계존속이 성년 직계비속에게 주는 경우 5,000만원(미성년은 2,000만원), 직계비속이 직계존속에게 주는 경우 5,000만원, 기타 친족 1,000만원입니다. 10년간 합산해 한 번만 적용됩니다.",
          },
          {
            law: "상속세 및 증여세법 제53조의2 (혼인·출산 증여재산공제)",
            detail:
              "직계존속으로부터 혼인신고일 전후 2년 이내 또는 출생·입양일부터 2년 이내에 증여받으면 1억원을 추가로 공제합니다. 기본 공제와 별개로 적용됩니다.",
          },
          {
            law: "상속세 및 증여세법 제56조 (세율)",
            detail:
              "과세표준 1억원 이하 10%, 5억원 이하 20%, 10억원 이하 30%, 30억원 이하 40%, 30억원 초과 50%의 누진세율을 적용하며 구간별 누진공제액을 뺍니다.",
          },
          {
            law: "상속세 및 증여세법 제69조 (신고세액공제)",
            detail:
              "신고기한 안에 신고하면 산출세액의 3%를 공제받습니다. 신고기한은 증여받은 달의 말일부터 3개월입니다.",
          },
        ]}
        note="10년 합산 규칙이 핵심입니다. 같은 사람에게서 10년 이내에 받은 증여는 합산해 계산하므로, 공제 한도를 이미 썼다면 이번 증여에는 공제가 적용되지 않습니다. 부담부증여(채무를 함께 넘기는 경우)는 양도소득세가 별도로 발생하므로 이 계산기로는 다룰 수 없습니다."
        examples={[
          {
            title: "성년 자녀가 부모에게 2억원을 증여받는 경우 (혼인·출산 공제 없음)",
            steps: [
              "증여재산가액 = 200,000,000원",
              "직계존속 → 성년 직계비속 공제 = 50,000,000원",
              "과세표준 = 200,000,000 − 50,000,000 = 150,000,000원",
              "1억 초과 5억 이하 구간 → 세율 20%, 누진공제 1,000만원",
              "산출세액 = 150,000,000 × 20% − 10,000,000 = 20,000,000원",
              "신고세액공제 3% = 600,000원",
            ],
            result: "납부할 증여세 19,400,000원",
          },
          {
            title: "결혼을 앞두고 있다면",
            steps: [
              "혼인신고일 전후 2년 이내라면 혼인 공제 1억원이 추가됩니다",
              "과세표준 = 200,000,000 − 50,000,000 − 100,000,000 = 50,000,000원",
              "1억 이하 구간 세율 10% → 산출세액 5,000,000원",
              "신고세액공제 3% 적용",
            ],
            result:
              "납부세액이 약 485만원으로 줄어듭니다 — 시점에 따라 1,455만원 차이",
          },
        ]}
        pitfalls={[
          {
            heading: "10년 합산을 놓치면 계산이 완전히 어긋납니다",
            body:
              "같은 증여자에게서 10년 이내에 받은 재산은 모두 합산합니다. 5년 전에 5,000만원을 받아 공제를 이미 썼다면, 이번 증여에는 공제가 남아 있지 않습니다.",
          },
          {
            heading: "공제는 증여자별이 아니라 그룹별입니다",
            body:
              "아버지와 어머니에게서 각각 5,000만원씩 받아도 공제가 두 번 적용되지는 않습니다. 직계존속은 하나의 그룹으로 묶어 한도를 계산합니다.",
          },
          {
            heading: "신고하지 않으면 가산세가 붙습니다",
            body:
              "증여받은 달의 말일부터 3개월이 신고기한입니다. 기한 내 신고하면 3% 공제를 받지만, 넘기면 무신고 가산세와 납부지연 가산세가 붙어 부담이 커집니다.",
          },
          {
            heading: "부동산을 증여받았다면 취득세도 따로 냅니다",
            body:
              "증여세와 별개로 지방세인 취득세가 부과됩니다. 증여 취득세율은 유상 취득과 다르게 적용되므로 함께 계산해 자금 계획을 세우세요.",
          },
        ]}
        sources={[
          { label: "국세청 홈택스", href: "https://www.hometax.go.kr" },
          { label: "국세청 증여세 안내", href: "https://www.nts.go.kr" },
          { label: "국가법령정보센터", href: "https://www.law.go.kr" },
        ]}
      />

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
