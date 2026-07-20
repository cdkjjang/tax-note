// 증여세 계산 — 상속세및증여세법 기준
//
// 구조: 증여재산가액 → 증여재산공제(관계별, 10년 합산) → 과세표준
//       → 세율(10~50%, 누진공제) → 산출세액 → 신고세액공제(3%) → 납부세액
//
// ⚠️ 동일인(증여자)으로부터 10년 내 받은 증여는 합산 과세된다. 이 계산기는
//    '이번 증여 1건'을 기준으로 하며, 과거 증여 합산·세대생략 할증(30·40%)·
//    각종 감면은 반영하지 않는 간이 추정이다.

export type GiftRelation =
  | "spouse" // 배우자
  | "linealAdult" // 직계존속 → 성년 직계비속
  | "linealMinor" // 직계존속 → 미성년 직계비속
  | "linealUp" // 직계비속 → 직계존속
  | "relative" // 기타 친족 (6촌 이내 혈족, 4촌 이내 인척)
  | "other"; // 그 외 (타인)

export const RELATION_DEDUCTION: Record<GiftRelation, number> = {
  spouse: 600_000_000,
  linealAdult: 50_000_000,
  linealMinor: 20_000_000,
  linealUp: 50_000_000,
  relative: 10_000_000,
  other: 0,
};

export const RELATION_LABEL: Record<GiftRelation, string> = {
  spouse: "배우자",
  linealAdult: "성년 자녀 (직계존속→비속)",
  linealMinor: "미성년 자녀 (직계존속→비속)",
  linealUp: "부모 (직계비속→존속)",
  relative: "기타 친족 (6촌 이내)",
  other: "타인",
};

/** 혼인·출산 증여재산공제 (2024년 신설) — 직계존속으로부터, 별도 한도 1억 */
export const MARRIAGE_BIRTH_DEDUCTION = 100_000_000;

// 증여세율 (상속세및증여세법 제56조) — 과세표준 구간별 세율·누진공제
export const GIFT_BRACKETS = [
  { limit: 100_000_000, rate: 0.1, deduct: 0 },
  { limit: 500_000_000, rate: 0.2, deduct: 10_000_000 },
  { limit: 1_000_000_000, rate: 0.3, deduct: 60_000_000 },
  { limit: 3_000_000_000, rate: 0.4, deduct: 160_000_000 },
  { limit: Infinity, rate: 0.5, deduct: 460_000_000 },
] as const;

export function giftTaxByBase(taxBase: number): number {
  if (taxBase <= 0) return 0;
  const b = GIFT_BRACKETS.find((x) => taxBase <= x.limit)!;
  return taxBase * b.rate - b.deduct;
}

export interface GiftTaxInput {
  giftAmount: number; // 증여재산가액
  relation: GiftRelation;
  marriageBirth: boolean; // 혼인·출산 공제 적용 여부 (직계존속 증여 시)
}

export interface GiftTaxResult {
  relationDeduction: number; // 관계별 증여재산공제
  marriageDeduction: number; // 혼인·출산 공제
  taxBase: number; // 과세표준
  calculatedTax: number; // 산출세액
  filingCredit: number; // 신고세액공제 (3%)
  payableTax: number; // 납부세액
  ratePct: number; // 적용 최고세율 (%)
}

export function calcGiftTax(
  input: GiftTaxInput
): { ok: true; result: GiftTaxResult } | { ok: false; error: "INVALID_INPUT" } {
  const giftAmount = Math.round(input.giftAmount);
  if (
    !Number.isFinite(giftAmount) ||
    giftAmount < 0 ||
    giftAmount > 100_000_000_000_000
  ) {
    return { ok: false, error: "INVALID_INPUT" };
  }

  const relationDeduction = RELATION_DEDUCTION[input.relation];
  // 혼인·출산 공제는 직계존속으로부터의 증여(성년/미성년 직계비속)일 때만 적용
  const eligibleForMarriage =
    input.relation === "linealAdult" || input.relation === "linealMinor";
  const marriageDeduction =
    input.marriageBirth && eligibleForMarriage ? MARRIAGE_BIRTH_DEDUCTION : 0;

  const taxBase = Math.max(
    0,
    giftAmount - relationDeduction - marriageDeduction
  );
  const calculatedTax = giftTaxByBase(taxBase);
  const filingCredit = Math.round(calculatedTax * 0.03);
  const payableTax = Math.max(0, calculatedTax - filingCredit);
  const bracket = GIFT_BRACKETS.find((x) => taxBase <= x.limit)!;

  return {
    ok: true,
    result: {
      relationDeduction,
      marriageDeduction,
      taxBase,
      calculatedTax: Math.round(calculatedTax),
      filingCredit,
      payableTax: Math.round(payableTax),
      ratePct: taxBase > 0 ? bracket.rate * 100 : 0,
    },
  };
}
