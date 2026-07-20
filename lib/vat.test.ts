import { describe, expect, it } from "vitest";
import { calcVat } from "./vat";

describe("calcVat — 부가가치세 10%", () => {
  it("add: 공급가액 100만 → 세액 10만, 합계 110만", () => {
    const out = calcVat(1_000_000, "add");
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result).toEqual({ supply: 1_000_000, vat: 100_000, total: 1_100_000 });
  });

  it("extract: 합계 110만 → 공급가액 100만, 세액 10만", () => {
    const out = calcVat(1_100_000, "extract");
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result).toEqual({ supply: 1_000_000, vat: 100_000, total: 1_100_000 });
  });

  it("fromTax: 세액 5만 → 공급가액 50만, 합계 55만", () => {
    const out = calcVat(50_000, "fromTax");
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result).toEqual({ supply: 500_000, vat: 50_000, total: 550_000 });
  });

  it("add → extract 왕복이 일치한다", () => {
    const added = calcVat(3_300_000, "add");
    expect(added.ok).toBe(true);
    if (!added.ok) return;
    const back = calcVat(added.result.total, "extract");
    expect(back.ok).toBe(true);
    if (!back.ok) return;
    expect(back.result.supply).toBe(3_300_000);
  });

  it("음수는 에러", () => {
    expect(calcVat(-1, "add").ok).toBe(false);
  });
});
