import { describe, expect, it } from "vitest";
import { INSURANCE_RATES, calcYearEnd } from "./year-end";

// ─────────────────────────────────────────────────────────────
// 고시값 고정 테스트
//
// 다른 테스트는 요율을 기호로 참조하거나 결과의 상대 관계만 보기 때문에,
// 요율이 1년 낡아도 전부 통과한다. 실제로 이 파일의 요율 세 개가 직전 연도
// 값으로 남아 있었는데 30개 테스트가 모두 통과했다.
// 그래서 **숫자 자체를 리터럴로 박아** 고시가 바뀌면 여기가 먼저 깨지게 한다.
//
// ⚠️ 이 값들은 급여노트 salary-note/lib/insurance.ts의 RATES와 같아야 한다.
// ─────────────────────────────────────────────────────────────
describe("4대보험 요율 — 급여노트와 같은 값이어야 한다", () => {
  it("근로자 부담 요율", () => {
    expect(INSURANCE_RATES.pension).toBe(0.0475); // 국민연금 4.75% (총 9.5%)
    expect(INSURANCE_RATES.health).toBe(0.03595); // 건강보험 3.595%
    expect(INSURANCE_RATES.longTermCareOfHealth).toBe(0.1314); // 장기요양 13.14%
    expect(INSURANCE_RATES.employment).toBe(0.009); // 고용보험 0.9%
  });

  it("국민연금 기준소득월액 상·하한 (매년 7월 조정)", () => {
    expect(INSURANCE_RATES.pensionBaseMax).toBe(6_590_000);
    expect(INSURANCE_RATES.pensionBaseMin).toBe(410_000);
  });

  it("상한을 넘는 고소득자는 연금보험료가 상한에서 멈춘다", () => {
    // 두 급여 모두 월 환산액이 기준소득월액 상한(659만)을 넘으므로 연금은 같다.
    const high = calcYearEnd({ ...base, grossSalary: 200_000_000 });
    const veryHigh = calcYearEnd({ ...base, grossSalary: 300_000_000 });
    if (!high.ok || !veryHigh.ok) throw new Error("calc failed");

    // 늘어난 1억에 대해 붙는 것은 건강·장기요양·고용뿐이고 연금은 0이어야 한다.
    const step = 100_000_000;
    const health = step * INSURANCE_RATES.health;
    const expected =
      health +
      health * INSURANCE_RATES.longTermCareOfHealth +
      step * INSURANCE_RATES.employment;

    const delta = veryHigh.result.insuranceDeduction - high.result.insuranceDeduction;
    expect(delta).toBeCloseTo(expected, 0); // 연금분이 섞이면 여기서 어긋난다
  });
});

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
