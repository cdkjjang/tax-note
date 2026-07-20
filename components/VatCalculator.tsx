"use client";

import { useState } from "react";
import { MoneyField, ResultCard, Row, parseMoney } from "./fields";
import { formatWon } from "@/lib/date";
import { calcVat, type VatMode } from "@/lib/vat";

const MODES: { key: VatMode; label: string; fieldLabel: string; hint: string }[] = [
  { key: "add", label: "공급가액 → 세액", fieldLabel: "공급가액", hint: "부가세 제외 금액" },
  { key: "extract", label: "합계에서 역산", fieldLabel: "합계 금액", hint: "부가세 포함 금액" },
  { key: "fromTax", label: "세액 → 금액", fieldLabel: "부가세액", hint: "세액만 알 때" },
];

export default function VatCalculator() {
  const [mode, setMode] = useState<VatMode>("add");
  const [amount, setAmount] = useState(""); // 원 단위

  const current = MODES.find((m) => m.key === mode)!;
  const value = parseMoney(amount);
  const ready = value !== null && value > 0;
  const outcome = ready ? calcVat(value, mode) : null;

  return (
    <section className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
      <div className="mb-5">
        <span className="mb-1.5 block font-bold">계산 방향</span>
        <div className="grid grid-cols-3 gap-2">
          {MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMode(m.key)}
              aria-pressed={mode === m.key}
              className={`rounded-xl border px-2 py-2 text-sm font-semibold transition-colors ${
                mode === m.key
                  ? "border-accent bg-accent text-white"
                  : "border-border-soft hover:border-accent"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <MoneyField
        label={current.fieldLabel}
        hint={current.hint}
        unit="원"
        value={amount}
        onChange={setAmount}
        placeholder="예: 1000000"
      />

      {!ready && (
        <p className="text-sm text-muted">금액을 입력하면 바로 계산됩니다.</p>
      )}

      {outcome && outcome.ok && (
        <ResultCard title="부가가치세 (세율 10%)">
          <p className="text-3xl font-extrabold text-accent-strong">
            부가세 {formatWon(outcome.result.vat)}
          </p>
          <dl className="mt-4 space-y-1.5 border-t border-border-soft pt-4 text-[15px]">
            <Row label="공급가액" value={formatWon(outcome.result.supply)} />
            <Row label="부가가치세" value={formatWon(outcome.result.vat)} />
            <div className="flex justify-between border-t border-border-soft pt-2 text-accent-strong">
              <dt className="font-bold">합계 (공급대가)</dt>
              <dd className="font-extrabold">{formatWon(outcome.result.total)}</dd>
            </div>
          </dl>
          <p className="mt-4 border-t border-border-soft pt-4 text-sm leading-relaxed text-muted">
            일반과세(세율 10%) 기준입니다. 간이과세자는 업종별 부가가치율(15~40%)을
            곱해 납부세액이 훨씬 낮고, 면세 대상 재화·용역에는 부가세가 붙지
            않습니다.
          </p>
        </ResultCard>
      )}
    </section>
  );
}
