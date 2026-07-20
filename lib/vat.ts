// 부가가치세(VAT) 계산 — 일반과세 기준 세율 10%
//
// 세 가지 방향을 지원한다.
//   add     : 공급가액 → 세액(10%) → 합계
//   extract : 합계(공급대가) → 공급가액·세액 역산 (부가세 포함 금액에서 뽑아내기)
//   fromTax : 세액 → 공급가액·합계 (세액만 알 때)
//
// ⚠️ 간이과세자는 업종별 부가가치율(15~40%)을 곱해 세액이 훨씬 낮다.
//    이 계산기는 일반과세(세율 10%) 기준이다.

export type VatMode = "add" | "extract" | "fromTax";

export interface VatResult {
  supply: number; // 공급가액
  vat: number; // 부가가치세
  total: number; // 합계 (공급대가)
}

const RATE = 0.1;

export function calcVat(
  amount: number,
  mode: VatMode
): { ok: true; result: VatResult } | { ok: false; error: "INVALID_INPUT" } {
  const n = Math.round(amount);
  if (!Number.isFinite(n) || n < 0 || n > 1_000_000_000_000) {
    return { ok: false, error: "INVALID_INPUT" };
  }

  let supply: number;
  let vat: number;
  let total: number;

  if (mode === "add") {
    supply = n;
    vat = Math.round(supply * RATE);
    total = supply + vat;
  } else if (mode === "extract") {
    total = n;
    // 공급가액 = 합계 ÷ 1.1 (반올림), 세액 = 합계 − 공급가액
    supply = Math.round(total / (1 + RATE));
    vat = total - supply;
  } else {
    vat = n;
    supply = vat * 10; // 세액이 공급가액의 10%이므로 공급가액 = 세액 × 10
    total = supply + vat;
  }

  return { ok: true, result: { supply, vat, total } };
}
