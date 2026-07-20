import { describe, expect, it } from "vitest";
import { calcIncomeTax } from "./income-tax";

describe("calcIncomeTax — 종합소득세", () => {
  it("소득금액 5,000만(본인 1): 과세표준 4,850만, 결정세액 601.5만", () => {
    const out = calcIncomeTax({
      incomeAmount: 50_000_000,
      dependents: 1,
      otherDeduction: 0,
      taxCredit: 0,
      prepaidTax: 0,
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.taxBase).toBe(48_500_000);
    // 48,500,000 × 15% − 126만 = 6,015,000
    expect(out.result.determinedTax).toBe(6_015_000);
    expect(out.result.localTax).toBe(601_500);
    expect(out.result.totalTax).toBe(6_616_500);
  });

  it("세액공제는 결정세액을 줄인다", () => {
    const base = calcIncomeTax({
      incomeAmount: 50_000_000,
      dependents: 1,
      otherDeduction: 0,
      taxCredit: 0,
      prepaidTax: 0,
    });
    const credited = calcIncomeTax({
      incomeAmount: 50_000_000,
      dependents: 1,
      otherDeduction: 0,
      taxCredit: 700_000,
      prepaidTax: 0,
    });
    expect(base.ok && credited.ok).toBe(true);
    if (!base.ok || !credited.ok) return;
    expect(credited.result.determinedTax).toBe(
      base.result.determinedTax - 700_000
    );
  });

  it("프리랜서 3.3% 원천징수보다 세액이 크면 추가납부(음수)", () => {
    const out = calcIncomeTax({
      incomeAmount: 40_000_000,
      dependents: 1,
      otherDeduction: 0,
      taxCredit: 0,
      prepaidTax: Math.round(40_000_000 * 0.033),
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.settlement).toBeLessThan(0);
  });

  it("과세표준이 0이면 세액 0", () => {
    const out = calcIncomeTax({
      incomeAmount: 1_000_000,
      dependents: 1,
      otherDeduction: 0,
      taxCredit: 0,
      prepaidTax: 0,
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.taxBase).toBe(0);
    expect(out.result.totalTax).toBe(0);
  });

  it("음수 소득금액은 에러", () => {
    expect(
      calcIncomeTax({
        incomeAmount: -100,
        dependents: 1,
        otherDeduction: 0,
        taxCredit: 0,
        prepaidTax: 0,
      }).ok
    ).toBe(false);
  });
});
