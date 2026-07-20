// 종합소득세 계산 — 프리랜서·사업자·기타소득자용
//
// 구조: 종합소득금액 → (인적공제 + 그 밖의 소득공제) → 과세표준
//       → 기본세율 산출세액 → 세액공제 → 결정세액, 지방소득세(10%)
//       → 기납부세액(원천징수 3.3% 등)과 비교해 환급/추가납부 정산
//
// ⚠️ 실제 종합소득세는 사업소득·근로·연금·기타 등 소득 유형별 산정 방식과
//    다양한 공제·감면이 얽혀 있다. 이 계산기는 '과세표준을 이미 아는 사람'이
//    세액을 빠르게 확인하는 간이 추정 도구다.

import { floor10, incomeTaxByBase, marginalRate } from "./tax-core";

export interface IncomeTaxInput {
  incomeAmount: number; // 종합소득금액 (수입금액 − 필요경비)
  dependents: number; // 기본공제 대상 인원 (본인 포함, 최소 1)
  otherDeduction: number; // 그 밖의 소득공제 합계 (국민연금·노란우산 등)
  taxCredit: number; // 세액공제 합계 (자녀·연금계좌·표준세액공제 등)
  prepaidTax: number; // 기납부세액 (원천징수·중간예납, 지방소득세 포함 총액)
}

export interface IncomeTaxResult {
  personalDeduction: number; // 인적공제
  taxBase: number; // 과세표준
  calculatedTax: number; // 산출세액
  determinedTax: number; // 결정세액 (산출세액 − 세액공제)
  localTax: number; // 지방소득세 (결정세액 × 10%)
  totalTax: number; // 총부담세액 (결정세액 + 지방소득세)
  effectiveRate: number; // 유효세율 (총부담 ÷ 종합소득금액, %)
  marginalRatePct: number; // 적용 한계세율 (%)
  settlement: number; // 정산액: 기납부 − 총부담 (양수=환급, 음수=추가납부)
}

export function calcIncomeTax(
  input: IncomeTaxInput
):
  | { ok: true; result: IncomeTaxResult }
  | { ok: false; error: "INVALID_INPUT" } {
  const incomeAmount = Math.round(input.incomeAmount);
  const dependents = Math.max(1, Math.floor(input.dependents));
  const otherDeduction = Math.max(0, Math.round(input.otherDeduction));
  const taxCredit = Math.max(0, Math.round(input.taxCredit));
  const prepaidTax = Math.max(0, Math.round(input.prepaidTax));

  if (
    !Number.isFinite(incomeAmount) ||
    incomeAmount < 0 ||
    incomeAmount > 1_000_000_000_000
  ) {
    return { ok: false, error: "INVALID_INPUT" };
  }

  const personalDeduction = dependents * 1_500_000;
  const taxBase = Math.max(
    0,
    incomeAmount - personalDeduction - otherDeduction
  );

  const calculatedTax = incomeTaxByBase(taxBase);
  const determinedTax = floor10(Math.max(0, calculatedTax - taxCredit));
  const localTax = floor10(determinedTax * 0.1);
  const totalTax = determinedTax + localTax;
  const effectiveRate =
    incomeAmount > 0 ? (totalTax / incomeAmount) * 100 : 0;
  const settlement = prepaidTax - totalTax;

  return {
    ok: true,
    result: {
      personalDeduction,
      taxBase,
      calculatedTax: floor10(calculatedTax),
      determinedTax,
      localTax,
      totalTax,
      effectiveRate,
      marginalRatePct: marginalRate(taxBase) * 100,
      settlement,
    },
  };
}
