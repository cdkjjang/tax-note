import { describe, expect, it } from "vitest";
import { calcGiftTax } from "./gift-tax";

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
