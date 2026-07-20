import { describe, expect, it } from "vitest";
import {
  earnedIncomeDeduction,
  earnedIncomeTaxCredit,
  incomeTaxByBase,
  marginalRate,
} from "./tax-core";

describe("incomeTaxByBase — 기본세율 산출세액", () => {
  it("과세표준 1,400만 경계 6%", () => {
    expect(incomeTaxByBase(14_000_000)).toBeCloseTo(840_000, 0);
  });
  it("과세표준 5,000만 경계 (15% − 126만)", () => {
    expect(incomeTaxByBase(50_000_000)).toBeCloseTo(6_240_000, 0);
  });
  it("과세표준 8,800만 경계 (24% − 576만)", () => {
    expect(incomeTaxByBase(88_000_000)).toBeCloseTo(15_360_000, 0);
  });
  it("0 이하는 0", () => {
    expect(incomeTaxByBase(0)).toBe(0);
    expect(incomeTaxByBase(-500)).toBe(0);
  });
});

describe("marginalRate — 한계세율", () => {
  it("1,400만 이하 6%", () => {
    expect(marginalRate(10_000_000)).toBe(0.06);
  });
  it("4,850만은 15% 구간", () => {
    expect(marginalRate(48_500_000)).toBe(0.15);
  });
});

describe("earnedIncomeDeduction — 근로소득공제", () => {
  it("총급여 5,000만: 1,200만 + 초과 5%", () => {
    // 12,000,000 + (50,000,000 − 45,000,000) × 5% = 12,250,000
    expect(earnedIncomeDeduction(50_000_000)).toBe(12_250_000);
  });
  it("한도 2,000만원", () => {
    expect(earnedIncomeDeduction(2_000_000_000)).toBe(20_000_000);
  });
});

describe("earnedIncomeTaxCredit — 근로소득세액공제 한도", () => {
  it("총급여 5,000만은 산출세액이 크면 한도 66만", () => {
    expect(earnedIncomeTaxCredit(5_000_000, 50_000_000)).toBe(660_000);
  });
});
