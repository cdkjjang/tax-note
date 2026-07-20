import { describe, expect, it } from "vitest";
import { calcYearEnd } from "./year-end";

const base = {
  grossSalary: 50_000_000,
  dependents: 1,
  prepaidTax: 3_000_000,
  cardSpending: 0,
  pensionSavings: 0,
  insurancePremium: 0,
  medicalExpense: 0,
  donation: 0,
};

describe("calcYearEnd — 연말정산", () => {
  it("총급여 5,000만 단독: 결정세액이 양수로 산출된다", () => {
    const out = calcYearEnd(base);
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.determinedTax).toBeGreaterThan(0);
    // 근로소득금액 = 5,000만 − 근로소득공제 1,225만 = 3,775만
    expect(out.result.earnedIncomeAmount).toBe(37_750_000);
  });

  it("정산액 = 기납부 − 결정세액", () => {
    const out = calcYearEnd(base);
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.settlement).toBe(
      out.result.prepaidTax - out.result.determinedTax
    );
  });

  it("연금저축 납입은 결정세액을 낮춰 환급을 늘린다", () => {
    const withPension = calcYearEnd({ ...base, pensionSavings: 9_000_000 });
    const without = calcYearEnd(base);
    expect(withPension.ok && without.ok).toBe(true);
    if (!withPension.ok || !without.ok) return;
    expect(withPension.result.determinedTax).toBeLessThan(
      without.result.determinedTax
    );
    // 연금계좌 세액공제 = 900만 × 15% = 135만
    expect(withPension.result.credits.pension).toBe(1_350_000);
  });

  it("신용카드 사용액이 총급여 25% 이하이면 공제 0", () => {
    const out = calcYearEnd({ ...base, cardSpending: 10_000_000 });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.cardDeduction).toBe(0);
  });

  it("의료비는 총급여 3% 초과분만 공제된다", () => {
    // 총급여 3% = 150만. 250만 지출 → 100만 × 15% = 15만
    const out = calcYearEnd({ ...base, medicalExpense: 2_500_000 });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.credits.medical).toBe(150_000);
  });

  it("총급여 0 이하는 에러", () => {
    expect(calcYearEnd({ ...base, grossSalary: 0 }).ok).toBe(false);
  });
});
