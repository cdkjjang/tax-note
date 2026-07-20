"use client";

import { useState } from "react";
import { MoneyField, ResultCard, Row, parseMoney } from "./fields";
import { formatWon } from "@/lib/date";
import { calcIncomeTax } from "@/lib/income-tax";

const DEP_OPTIONS = [1, 2, 3, 4, 5, 6];
const MAN = 10_000;

const selectClass =
  "w-full rounded-xl border border-border-soft bg-card px-4 py-2.5 text-[15px] outline-none transition-colors focus:border-accent";

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState(""); // 종합소득금액, 만원
  const [dependents, setDependents] = useState("1");
  const [deduction, setDeduction] = useState(""); // 그 밖의 소득공제, 만원
  const [credit, setCredit] = useState(""); // 세액공제, 만원
  const [prepaid, setPrepaid] = useState(""); // 기납부세액, 만원

  const incomeMan = parseMoney(income);
  const ready = incomeMan !== null && incomeMan > 0;

  const outcome = ready
    ? calcIncomeTax({
        incomeAmount: incomeMan * MAN,
        dependents: Number(dependents),
        otherDeduction: (parseMoney(deduction) ?? 0) * MAN,
        taxCredit: (parseMoney(credit) ?? 0) * MAN,
        prepaidTax: (parseMoney(prepaid) ?? 0) * MAN,
      })
    : null;

  const hasPrepaid = (parseMoney(prepaid) ?? 0) > 0;

  return (
    <section className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
      <MoneyField
        label="종합소득금액"
        hint="수입금액 − 필요경비"
        unit="만원"
        value={income}
        onChange={setIncome}
        placeholder="예: 5000"
      />

      <div className="grid grid-cols-2 gap-3">
        <label className="mb-5 block">
          <span className="mb-1.5 block font-bold">부양가족 수</span>
          <select className={selectClass} value={dependents} onChange={(e) => setDependents(e.target.value)}>
            {DEP_OPTIONS.map((d) => (
              <option key={d} value={d}>{d}명</option>
            ))}
          </select>
        </label>
        <MoneyField label="그 밖의 소득공제" hint="국민연금 등" unit="만원" value={deduction} onChange={setDeduction} placeholder="0" />
        <MoneyField label="세액공제" hint="자녀·연금계좌 등" unit="만원" value={credit} onChange={setCredit} placeholder="0" />
        <MoneyField label="기납부세액" hint="원천징수·중간예납" unit="만원" value={prepaid} onChange={setPrepaid} placeholder="0" />
      </div>

      {!ready && (
        <p className="text-sm text-muted">종합소득금액을 입력하면 바로 계산됩니다.</p>
      )}

      {outcome && outcome.ok && (
        <ResultCard title={hasPrepaid ? "예상 정산 결과 (지방소득세 포함)" : "예상 세액 (지방소득세 포함)"}>
          {hasPrepaid ? (
            <p
              className={`text-3xl font-extrabold ${
                outcome.result.settlement >= 0 ? "text-accent-strong" : "text-red-600 dark:text-red-400"
              }`}
            >
              {outcome.result.settlement >= 0 ? "환급 " : "추가납부 "}
              {formatWon(Math.abs(outcome.result.settlement))}
            </p>
          ) : (
            <p className="text-3xl font-extrabold text-accent-strong">
              {formatWon(outcome.result.totalTax)}
            </p>
          )}
          <p className="mt-1 text-sm text-muted">
            과세표준 {formatWon(outcome.result.taxBase)} · 한계세율{" "}
            {outcome.result.marginalRatePct}% · 유효세율{" "}
            {outcome.result.effectiveRate.toFixed(1)}%
          </p>

          <dl className="mt-4 space-y-1.5 border-t border-border-soft pt-4 text-[15px]">
            <Row label="인적공제" value={formatWon(outcome.result.personalDeduction)} />
            <Row label="과세표준" value={formatWon(outcome.result.taxBase)} />
            <Row label="산출세액" value={formatWon(outcome.result.calculatedTax)} />
            <Row label="결정세액 (소득세)" value={formatWon(outcome.result.determinedTax)} />
            <Row label="지방소득세 (10%)" value={formatWon(outcome.result.localTax)} />
            <div className="flex justify-between border-t border-border-soft pt-2 text-accent-strong">
              <dt className="font-bold">총 부담세액</dt>
              <dd className="font-extrabold">{formatWon(outcome.result.totalTax)}</dd>
            </div>
          </dl>

          <p className="mt-4 border-t border-border-soft pt-4 text-sm leading-relaxed text-muted">
            종합소득 기본세율로 계산한 간이 추정치입니다. 사업·근로·연금·기타 등
            소득 유형별 산정과 감면은 반영하지 않았습니다. 프리랜서(3.3% 원천징수)는
            기납부세액에 원천징수액을 넣어 5월 신고 시 환급·추가납부를 가늠할 수
            있습니다.
          </p>
        </ResultCard>
      )}
    </section>
  );
}
