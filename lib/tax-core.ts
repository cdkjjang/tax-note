// 소득세 공통 로직 — 종합소득 기본세율, 근로소득공제, 근로소득세액공제, 지방소득세.
// 종합소득세 계산기와 연말정산 계산기가 함께 사용한다.
//
// 근거: 소득세법 제55조(기본세율, 2023년 개정), 제47조(근로소득공제), 제59조(근로소득세액공제).
// 세율·공제는 개정 시 이 파일과 테스트를 함께 갱신할 것.

/** 종합소득 기본세율 (소득세법 제55조) — 과세표준 구간별 세율·누진공제 */
export const INCOME_TAX_BRACKETS = [
  { limit: 14_000_000, rate: 0.06, deduct: 0 },
  { limit: 50_000_000, rate: 0.15, deduct: 1_260_000 },
  { limit: 88_000_000, rate: 0.24, deduct: 5_760_000 },
  { limit: 150_000_000, rate: 0.35, deduct: 15_440_000 },
  { limit: 300_000_000, rate: 0.38, deduct: 19_940_000 },
  { limit: 500_000_000, rate: 0.4, deduct: 25_940_000 },
  { limit: 1_000_000_000, rate: 0.42, deduct: 35_940_000 },
  { limit: Infinity, rate: 0.45, deduct: 65_940_000 },
] as const;

/** 과세표준 → 산출세액 (기본세율) */
export function incomeTaxByBase(taxBase: number): number {
  if (taxBase <= 0) return 0;
  const b = INCOME_TAX_BRACKETS.find((x) => taxBase <= x.limit)!;
  return taxBase * b.rate - b.deduct;
}

/** 적용 한계세율(%) — 과세표준이 속한 구간의 세율 */
export function marginalRate(taxBase: number): number {
  if (taxBase <= 0) return 0;
  return INCOME_TAX_BRACKETS.find((x) => taxBase <= x.limit)!.rate;
}

/** 근로소득공제 (소득세법 제47조, 한도 2,000만원) */
export function earnedIncomeDeduction(grossSalary: number): number {
  let d: number;
  if (grossSalary <= 5_000_000) d = grossSalary * 0.7;
  else if (grossSalary <= 15_000_000)
    d = 3_500_000 + (grossSalary - 5_000_000) * 0.4;
  else if (grossSalary <= 45_000_000)
    d = 7_500_000 + (grossSalary - 15_000_000) * 0.15;
  else if (grossSalary <= 100_000_000)
    d = 12_000_000 + (grossSalary - 45_000_000) * 0.05;
  else d = 14_750_000 + (grossSalary - 100_000_000) * 0.02;
  return Math.min(d, 20_000_000);
}

/** 근로소득세액공제 (소득세법 제59조, 총급여별 한도 적용) */
export function earnedIncomeTaxCredit(
  calculatedTax: number,
  grossSalary: number
): number {
  const credit =
    calculatedTax <= 1_300_000
      ? calculatedTax * 0.55
      : 715_000 + (calculatedTax - 1_300_000) * 0.3;

  let cap: number;
  if (grossSalary <= 33_000_000) cap = 740_000;
  else if (grossSalary <= 70_000_000)
    cap = Math.max(660_000, 740_000 - (grossSalary - 33_000_000) * 0.008);
  else if (grossSalary <= 120_000_000)
    cap = Math.max(500_000, 660_000 - (grossSalary - 70_000_000) * 0.5);
  else cap = Math.max(200_000, 500_000 - (grossSalary - 120_000_000) * 0.5);

  return Math.min(credit, cap);
}

/** 10원 미만 절사 (국세 원 단위 이하 절사 관행 근사) */
export function floor10(n: number): number {
  return Math.floor(n / 10 + 1e-6) * 10;
}
