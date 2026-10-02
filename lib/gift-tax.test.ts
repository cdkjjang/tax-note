import { describe, expect, it } from "vitest";
import { RELATION_DEDUCTION, RELATION_LABEL, calcGiftTax } from "./gift-tax";

describe("calcGiftTax — 증여세", () => {
  it("성년 자녀에게 5억 증여: 공제 5천만, 산출세액 8,000만", () => {
    const out = calcGiftTax({
      giftAmount: 500_000_000,
      relation: "linealAdult",
      marriageBirth: false,
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.relationDeduction).toBe(50_000_000);
    expect(out.result.taxBase).toBe(450_000_000);
    // 4.5억 × 20% − 1,000만 = 8,000만
    expect(out.result.calculatedTax).toBe(80_000_000);
    // 신고세액공제 3% = 240만, 납부세액 7,760만
    expect(out.result.filingCredit).toBe(2_400_000);
    expect(out.result.payableTax).toBe(77_600_000);
  });

  it("배우자에게 6억 증여: 공제 6억으로 과세표준 0, 세액 0", () => {
    const out = calcGiftTax({
      giftAmount: 600_000_000,
      relation: "spouse",
      marriageBirth: false,
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.taxBase).toBe(0);
    expect(out.result.payableTax).toBe(0);
  });

  it("혼인공제 1억 적용: 성년 자녀 1.5억 → 과세표준 0", () => {
    const out = calcGiftTax({
      giftAmount: 150_000_000,
      relation: "linealAdult",
      marriageBirth: true,
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.marriageDeduction).toBe(100_000_000);
    expect(out.result.taxBase).toBe(0);
    expect(out.result.payableTax).toBe(0);
  });

  it("혼인공제는 배우자 증여에는 적용되지 않는다", () => {
    const out = calcGiftTax({
      giftAmount: 700_000_000,
      relation: "spouse",
      marriageBirth: true,
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.marriageDeduction).toBe(0);
  });

  it("과세표준 50만원 미만이면 세금이 없다 (상증법 제55조②)", () => {
    const small = calcGiftTax({ giftAmount: 50_490_000, relation: "linealAdult", marriageBirth: false });
    expect(small.ok && small.result.taxBase).toBe(490_000);
    expect(small.ok && small.result.payableTax).toBe(0);
    const edge = calcGiftTax({ giftAmount: 50_500_000, relation: "linealAdult", marriageBirth: false });
    // 과세표준 50만원 → 5만원 × (1 − 3%) = 48,500원
    expect(edge.ok && edge.result.payableTax).toBe(48_500);
  });

  it("기타 친족 공제 1천만원, 표시는 4촌 혈족·3촌 인척 (제53조 4호)", () => {
    expect(RELATION_DEDUCTION.relative).toBe(10_000_000);
    expect(RELATION_LABEL.relative).toContain("4촌");
    expect(RELATION_LABEL.relative).not.toContain("6촌");
  });

  it("미성년 자녀 1억 증여: 공제 2천만, 과세표준 8천만 × 10%", () => {
    const out = calcGiftTax({
      giftAmount: 100_000_000,
      relation: "linealMinor",
      marriageBirth: false,
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.taxBase).toBe(80_000_000);
    expect(out.result.calculatedTax).toBe(8_000_000);
    expect(out.result.payableTax).toBe(7_760_000);
  });
});
