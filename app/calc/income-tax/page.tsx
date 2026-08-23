import type { Metadata } from "next";
import CalcGuides from "@/components/CalcGuides";
import Link from "next/link";
import IncomeTaxCalculator from "@/components/IncomeTaxCalculator";
import AdSlot from "@/components/AdSlot";
import CalcNotes from "@/components/CalcNotes";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "종합소득세 계산기 — 소득금액으로 세액·5월 정산 미리보기",
  description:
    "종합소득금액과 공제를 넣으면 종합소득세와 지방소득세, 유효세율을 바로 계산합니다. 프리랜서 3.3% 원천징수와 비교해 5월 신고 환급·추가납부까지 가늠하세요.",
  alternates: { canonical: "/calc/income-tax" },
};

const faq = [
  {
    q: "종합소득금액은 무엇을 넣나요?",
    a: "매출(수입금액)에서 필요경비를 뺀 금액입니다. 장부를 쓰면 실제 경비를, 그렇지 않으면 업종별 단순·기준경비율을 적용한 금액을 넣습니다. 근로소득이 함께 있으면 근로소득금액도 합산합니다.",
  },
  {
    q: "프리랜서 3.3%는 어디에 넣나요?",
    a: "'기납부세액'에 1년간 원천징수된 금액을 넣으세요. 3.3%는 소득세 3% + 지방세 0.3%로, 이 계산기의 총부담세액(소득세+지방세)과 비교하면 5월 신고 시 환급·추가납부를 가늠할 수 있습니다.",
  },
  {
    q: "종합소득세 신고는 언제 하나요?",
    a: "매년 5월 1일부터 31일까지 전년도 소득을 신고·납부합니다. 성실신고확인 대상은 6월 말까지입니다. 기한을 넘기면 무신고가산세와 납부지연가산세가 붙습니다.",
  },
  {
    q: "직장인도 종합소득세 대상인가요?",
    a: "근로소득만 있으면 연말정산으로 끝납니다. 근로 외에 사업·기타소득이나 금융소득(연 2천만원 초과)이 있으면 5월에 합산해 종합소득세를 신고해야 합니다.",
  },
];

export default function IncomeTaxPage() {
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
          { "@type": "ListItem", position: 2, name: "종합소득세 계산기" },
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
      <h1 className="mb-2 text-2xl font-extrabold">종합소득세 계산기</h1>
      <p className="mb-6 text-muted">
        프리랜서·사업자·부업 소득이 있다면, 소득금액과 공제를 넣어 5월에 낼
        종합소득세와 지방소득세를 미리 확인하세요.
      </p>
      <IncomeTaxCalculator />

      <AdSlot slot="income-tax-below-tool" />

      <section className="mt-10 space-y-4 text-[15px] leading-relaxed">
        <h2 className="text-xl font-bold">3.3% 떼였는데 왜 또 낼까</h2>
        <p>
          프리랜서·인적용역 소득에서 떼는 3.3%는 &lsquo;미리 낸 세금&rsquo;일 뿐,
          최종 세금이 아닙니다. 1년 소득을 모아 실제 세금을 계산한 뒤, 이미 뗀
          3.3%와 비교해 5월에 정산합니다. 소득이 적고 경비가 많으면 환급받고,
          소득이 크면 3.3%로는 부족해 추가로 냅니다.
        </p>
        <p>
          세금은 매출 전체가 아니라 &lsquo;소득금액(매출 − 필요경비)&rsquo;에
          매깁니다. 여기에 인적공제 등을 빼 과세표준을 구하고, 근로소득자와 같은
          기본세율(6~45%)을 적용합니다. 이 계산기는 과세표준까지의 흐름을 그대로
          보여주므로, 내 소득이 어느 세율 구간에 있는지, 공제가 세금을 얼마나
          줄이는지 확인할 수 있습니다.
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
            law: "소득세법 제14조 (과세표준의 계산)",
            detail:
              "종합소득금액(수입금액에서 필요경비를 뺀 금액)에서 인적공제와 그 밖의 소득공제를 빼면 과세표준이 됩니다.",
          },
          {
            law: "소득세법 제55조 (세율)",
            detail:
              "과세표준 구간별 6%·15%·24%·35%·38%·40%·42%·45%의 누진세율을 적용합니다. 구간별 누진공제액을 빼는 방식으로 계산합니다.",
          },
          {
            law: "지방세법 제92조 (지방소득세)",
            detail:
              "소득세 결정세액의 10%가 지방소득세로 별도 부과됩니다. 소득세와 함께 신고·납부합니다.",
          },
          {
            law: "소득세법 제70조 (확정신고)",
            detail:
              "종합소득이 있는 거주자는 다음 해 5월 1일부터 5월 31일까지 신고·납부해야 합니다. 성실신고확인 대상자는 6월 말까지입니다.",
          },
        ]}
        note="이 계산기는 소득금액을 직접 입력받는 구조입니다. 업종별 경비율로 필요경비를 추계하는 경우와 장부를 작성해 실제 경비를 반영하는 경우의 결과가 크게 다르므로, 소득금액 산정 단계부터 확인이 필요합니다."
        examples={[
          {
            title: "종합소득금액 4,000만원 · 부양가족 본인 1명 · 그 밖의 소득공제 300만원 · 세액공제 7만원 · 기납부 132만원",
            steps: [
              "인적공제 = 1명 × 150만원 = 1,500,000원",
              "과세표준 = 40,000,000 − 1,500,000 − 3,000,000 = 35,500,000원",
              "3,550만원은 15% 구간 → 산출세액 = 35,500,000 × 15% − 1,260,000 = 4,065,000원",
              "세액공제 70,000원을 빼면 결정세액 3,995,000원",
              "지방소득세 = 3,995,000 × 10% = 399,500원",
              "총 부담 4,394,500원, 기납부 1,320,000원과 비교",
            ],
            result:
              "추가납부 3,074,500원 — 실효세율 약 11%, 한계세율 15%",
          },
          {
            title: "3.3%를 떼였는데 왜 더 내야 하나",
            steps: [
              "프리랜서 원천징수 3.3%는 소득세 3% + 지방소득세 0.3%의 선납입니다",
              "실제 세금은 1년치 소득을 합산해 누진세율로 계산합니다",
              "소득이 커서 세율 구간이 올라가면 3.3%로는 부족해집니다",
            ],
            result:
              "반대로 경비가 많고 소득이 적으면 환급이 나옵니다 — 경비 증빙이 중요한 이유입니다",
          },
        ]}
        pitfalls={[
          {
            heading: "필요경비를 어떻게 잡느냐가 세금을 좌우합니다",
            body:
              "장부를 쓰지 않으면 업종별 경비율로 추계하는데, 실제 경비가 더 많았다면 손해입니다. 사업용 카드와 세금계산서를 구분해 모아두면 다음 신고에서 장부로 처리해 세금을 줄일 수 있습니다.",
          },
          {
            heading: "근로소득이 함께 있으면 합산해야 합니다",
            body:
              "회사에서 연말정산을 마쳤어도 부업 소득이 있으면 5월에 합산 신고해야 합니다. 합산하면 세율 구간이 올라가 추가납부가 나오는 경우가 많습니다.",
          },
          {
            heading: "5월을 넘기면 가산세가 붙습니다",
            body:
              "무신고 가산세와 납부지연 가산세가 함께 붙습니다. 세금을 낼 돈이 부족하더라도 신고는 기한 내에 하는 편이 부담이 적습니다.",
          },
          {
            heading: "지방소득세는 따로 신고 대상입니다",
            body:
              "소득세 신고와 함께 처리되지만 납부는 별도로 이루어집니다. 홈택스에서 소득세만 내고 위택스에서 지방소득세를 빠뜨리는 경우가 있으니 둘 다 확인하세요.",
          },
        ]}
        sources={[
          { label: "국세청 홈택스", href: "https://www.hometax.go.kr" },
          { label: "위택스", href: "https://www.wetax.go.kr" },
          { label: "국가법령정보센터", href: "https://www.law.go.kr" },
        ]}
      />

      <section className="mt-10 rounded-2xl border border-border-soft bg-card p-5">
        <h2 className="mb-3 font-bold">함께 확인하세요</h2>
        <ul className="space-y-2 text-[15px]">
          <li>
            <Link href="/guide/income-tax-guide" className="text-accent underline-offset-4 hover:underline">
              종합소득세 신고 기초 → 프리랜서·부업자의 5월
            </Link>
          </li>
          <li>
            <Link href="/calc/vat" className="text-accent underline-offset-4 hover:underline">
              부가가치세 계산기 → 사업자라면
            </Link>
          </li>
          <li>
            <Link href="/calc/year-end" className="text-accent underline-offset-4 hover:underline">
              연말정산 환급 계산기 → 근로소득이 있다면
            </Link>
          </li>
        </ul>
      </section>
      <CalcGuides calcHref="/calc/income-tax" />
    </div>
  );
}
