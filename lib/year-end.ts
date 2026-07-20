// 연말정산 환급/추가납부 간이 계산 — 근로소득자용 (플래그십)
//
// 구조:
//   총급여 → 근로소득공제 → 근로소득금액
//   소득공제: 인적공제 + 4대보험료(추정) + 신용카드등 사용액 공제
//   → 과세표준 → 기본세율 산출세액
//   세액공제: 근로소득세액공제 + 연금계좌 + 보장성보험료 + 의료비 + 기부금
//   → 결정세액(소득세) → 기납부(원천징수)세액과 비교 → 환급/추가납부
//
// ⚠️ 실제 연말정산은 주택자금·월세·교육비·자녀·기부금 유형별 한도 등 항목이 훨씬 많다.
//    이 계산기는 대표 공제만 반영한 '간이 추정치'이며, 결과는 소득세 기준이다.
//    지방소득세(결정세액의 10%)는 별도로 함께 정산된다.

import {
  earnedIncomeDeduction,
  earnedIncomeTaxCredit,
  floor10,
  incomeTaxByBase,
} from "./tax-core";

export interface YearEndInput {
  grossSalary: number; // 총급여 (비과세 제외 연간 급여)
  dependents: number; // 기본공제 대상 인원 (본인 포함, 최소 1)
  prepaidTax: number; // 기납부세액 (원천징수영수증의 소득세 결정 전 기납부, 소득세분)
  cardSpending: number; // 신용카드·체크카드·현금영수증 등 총 사용액
  pensionSavings: number; // 연금저축 + IRP 납입액
  insurancePremium: number; // 보장성보험료 납입액
  medicalExpense: number; // 의료비 지출액
  donation: number; // 기부금
}

export interface YearEndResult {
  earnedIncomeAmount: number; // 근로소득금액
  insuranceDeduction: number; // 4대보험료 소득공제(추정)
  personalDeduction: number; // 인적공제
  cardDeduction: number; // 신용카드등 소득공제
  taxBase: number; // 과세표준
  calculatedTax: number; // 산출세액
  credits: {
    earned: number; // 근로소득세액공제
    pension: number; // 연금계좌 세액공제
    insurance: number; // 보장성보험료 세액공제
    medical: number; // 의료비 세액공제
    donation: number; // 기부금 세액공제
    total: number; // 세액공제 합계
  };
  determinedTax: number; // 결정세액 (소득세)
  prepaidTax: number; // 기납부세액
  settlement: number; // 정산액: 기납부 − 결정세액 (양수=환급, 음수=추가납부)
  localTaxRefund: number; // 지방소득세분 정산 참고치 (정산액의 10%)
}

export function calcYearEnd(
  input: YearEndInput
): { ok: true; result: YearEndResult } | { ok: false; error: "INVALID_INPUT" } {
  const grossSalary = Math.round(input.grossSalary);
  const dependents = Math.max(1, Math.floor(input.dependents));
  const prepaidTax = Math.max(0, Math.round(input.prepaidTax));
  const cardSpending = Math.max(0, Math.round(input.cardSpending));
  const pensionSavings = Math.max(0, Math.round(input.pensionSavings));
  const insurancePremium = Math.max(0, Math.round(input.insurancePremium));
  const medicalExpense = Math.max(0, Math.round(input.medicalExpense));
  const donation = Math.max(0, Math.round(input.donation));

  if (
    !Number.isFinite(grossSalary) ||
    grossSalary <= 0 ||
    grossSalary > 100_000_000_000
  ) {
    return { ok: false, error: "INVALID_INPUT" };
  }

  // --- 소득공제 ---
  const earnedIncomeAmount = Math.max(
    0,
    grossSalary - earnedIncomeDeduction(grossSalary)
  );

  // 4대보험료 소득공제(근로자분) 추정 — 국민연금(연금보험료공제) + 건강·장기요양·고용(보험료 특별소득공제)
  const monthlyGross = grossSalary / 12;
  const pensionBase = Math.min(monthlyGross, 6_370_000); // 국민연금 기준소득월액 상한(2025.7~2026.6)
  const nationalPension = pensionBase * 0.045 * 12;
  const health = monthlyGross * 0.03545 * 12;
  const longTermCare = health * 0.1295;
  const employment = monthlyGross * 0.009 * 12;
  const insuranceDeduction = Math.round(
    nationalPension + health + longTermCare + employment
  );

  const personalDeduction = dependents * 1_500_000;

  // 신용카드등 소득공제 — 총급여 25% 초과분에 15% 적용(대표율), 총급여별 한도.
  // 실제는 결제수단(체크·현금 30%, 전통시장·대중교통 40%)에 따라 공제율이 다름.
  const cardThreshold = grossSalary * 0.25;
  const cardBase = Math.max(0, cardSpending - cardThreshold);
  const cardCap = grossSalary <= 70_000_000 ? 3_000_000 : 2_500_000;
  const cardDeduction = Math.min(Math.round(cardBase * 0.15), cardCap);

  const taxBase = Math.max(
    0,
    earnedIncomeAmount -
      personalDeduction -
      insuranceDeduction -
      cardDeduction
  );

  const calculatedTax = incomeTaxByBase(taxBase);

  // --- 세액공제 ---
  const earnedCredit = earnedIncomeTaxCredit(calculatedTax, grossSalary);

  // 연금계좌(연금저축+IRP) 세액공제 — 통합 한도 900만, 총급여 5,500만 이하 15% / 초과 12%
  const pensionRate = grossSalary <= 55_000_000 ? 0.15 : 0.12;
  const pensionCredit = Math.min(pensionSavings, 9_000_000) * pensionRate;

  // 보장성보험료 세액공제 — 한도 100만, 12%
  const insuranceCredit = Math.min(insurancePremium, 1_000_000) * 0.12;

  // 의료비 세액공제 — 총급여 3% 초과분에 15%
  const medicalBase = Math.max(0, medicalExpense - grossSalary * 0.03);
  const medicalCredit = medicalBase * 0.15;

  // 기부금 세액공제 — 1천만 이하 15%, 초과분 30% (대표율)
  const donationCredit =
    Math.min(donation, 10_000_000) * 0.15 +
    Math.max(0, donation - 10_000_000) * 0.3;

  const creditTotal = Math.round(
    earnedCredit +
      pensionCredit +
      insuranceCredit +
      medicalCredit +
      donationCredit
  );

  const determinedTax = floor10(Math.max(0, calculatedTax - creditTotal));
  const settlement = prepaidTax - determinedTax;
  const localTaxRefund = floor10(settlement * 0.1);

  return {
    ok: true,
    result: {
      earnedIncomeAmount: Math.round(earnedIncomeAmount),
      insuranceDeduction,
      personalDeduction,
      cardDeduction,
      taxBase,
      calculatedTax: floor10(calculatedTax),
      credits: {
        earned: Math.round(earnedCredit),
        pension: Math.round(pensionCredit),
        insurance: Math.round(insuranceCredit),
        medical: Math.round(medicalCredit),
        donation: Math.round(donationCredit),
        total: creditTotal,
      },
      determinedTax,
      prepaidTax,
      settlement,
      localTaxRefund,
    },
  };
}
