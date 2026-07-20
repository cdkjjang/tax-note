"use client";

import { useState } from "react";
import { MoneyField, ResultCard, Row, parseMoney } from "./fields";
import { formatWon } from "@/lib/date";
import { calcYearEnd } from "@/lib/year-end";

const DEP_OPTIONS = [1, 2, 3, 4, 5, 6];
const MAN = 10_000;

const selectClass =
  "w-full rounded-xl border border-border-soft bg-card px-4 py-2.5 text-[15px] outline-none transition-colors focus:border-accent";

export default function YearEndCalculator() {
  const [salary, setSalary] = useState(""); // 총급여, 만원
  const [dependents, setDependents] = useState("1");
  const [prepaid, setPrepaid] = useState(""); // 기납부세액, 만원
  const [card, setCard] = useState(""); // 신용카드등, 만원
  const [pension, setPension] = useState(""); // 연금저축+IRP, 만원
  const [insurance, setInsurance] = useState(""); // 보장성보험료, 만원
  const [medical, setMedical] = useState(""); // 의료비, 만원
  const [donation, setDonation] = useState(""); // 기부금, 만원

  const salaryMan = parseMoney(salary);
  const ready = salaryMan !== null && salaryMan > 0;

  const outcome = ready
    ? calcYearEnd({
        grossSalary: salaryMan * MAN,
        dependents: Number(dependents),
        prepaidTax: (parseMoney(prepaid) ?? 0) * MAN,
        cardSpending: (parseMoney(card) ?? 0) * MAN,
        pensionSavings: (parseMoney(pension) ?? 0) * MAN,
        insurancePremium: (parseMoney(insurance) ?? 0) * MAN,
        medicalExpense: (parseMoney(medical) ?? 0) * MAN,
        donation: (parseMoney(donation) ?? 0) * MAN,
      })
    : null;

  const hasPrepaid = (parseMoney(prepaid) ?? 0) > 0;

  return (
    <section className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
      <MoneyField
        label="총급여 (연간, 비과세 제외)"
        hint="원천징수영수증 '총급여'"
        unit="만원"
        value={salary}
        onChange={setSalary}
        placeholder="예: 5000"
      />

      <label className="mb-5 block">
        <span className="mb-1.5 block font-bold">
          부양가족 수
          <span className="ml-2 text-xs font-normal text-muted">본인 포함, 기본공제 대상</span>
        </span>
        <select
          className={selectClass}
          value={dependents}
          onChange={(e) => setDependents(e.target.value)}
        >
          {DEP_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {d}명
            </option>
          ))}
        </select>
      </label>

      <MoneyField
        label="기납부세액 (원천징수 소득세)"
        hint="비우면 결정세액만 표시"
        unit="만원"
        value={prepaid}
        onChange={setPrepaid}
        placeholder="예: 300"
      />

      <p className="mb-3 mt-1 text-sm font-bold text-accent-strong">
        공제 항목 (아는 것만 입력)
      </p>
      <div className="grid grid-cols-2 gap-3">
        <MoneyField label="신용카드등 사용액" unit="만원" value={card} onChange={setCard} placeholder="0" />
        <MoneyField label="연금저축·IRP 납입" unit="만원" value={pension} onChange={setPension} placeholder="0" />
        <MoneyField label="보장성보험료" unit="만원" value={insurance} onChange={setInsurance} placeholder="0" />
        <MoneyField label="의료비" unit="만원" value={medical} onChange={setMedical} placeholder="0" />
        <MoneyField label="기부금" unit="만원" value={donation} onChange={setDonation} placeholder="0" />
      </div>

      {!ready && (
        <p className="text-sm text-muted">총급여를 입력하면 바로 계산됩니다.</p>
      )}

      {outcome && outcome.ok && (
        <ResultCard
          title={hasPrepaid ? "예상 정산 결과 (소득세 기준)" : "예상 결정세액 (소득세)"}
        >
          {hasPrepaid ? (
            <>
              <p
                className={`text-3xl font-extrabold ${
                  outcome.result.settlement >= 0 ? "text-accent-strong" : "text-red-600 dark:text-red-400"
                }`}
              >
                {outcome.result.settlement >= 0 ? "환급 " : "추가납부 "}
                {formatWon(Math.abs(outcome.result.settlement))}
              </p>
              <p className="mt-1 text-sm text-muted">
                기납부 {formatWon(outcome.result.prepaidTax)} − 결정세액{" "}
                {formatWon(outcome.result.determinedTax)}
                {outcome.result.localTaxRefund !== 0 && (
                  <>
                    {" "}· 지방소득세분 약{" "}
                    {formatWon(Math.abs(outcome.result.localTaxRefund))}{" "}
                    {outcome.result.localTaxRefund >= 0 ? "추가 환급" : "추가 납부"}
                  </>
                )}
              </p>
            </>
          ) : (
            <p className="text-3xl font-extrabold text-accent-strong">
              {formatWon(outcome.result.determinedTax)}
            </p>
          )}

          <dl className="mt-4 space-y-1.5 border-t border-border-soft pt-4 text-[15px]">
            <Row label="과세표준" value={formatWon(outcome.result.taxBase)} />
            <Row label="산출세액" value={formatWon(outcome.result.calculatedTax)} />
            <p className="pt-1 text-sm font-bold text-accent-strong">
              세액공제 −{formatWon(outcome.result.credits.total)}
            </p>
            <Row label="· 근로소득세액공제" value={formatWon(outcome.result.credits.earned)} />
            {outcome.result.credits.pension > 0 && (
              <Row label="· 연금계좌" value={formatWon(outcome.result.credits.pension)} />
            )}
            {outcome.result.credits.insurance > 0 && (
              <Row label="· 보장성보험료" value={formatWon(outcome.result.credits.insurance)} />
            )}
            {outcome.result.credits.medical > 0 && (
              <Row label="· 의료비" value={formatWon(outcome.result.credits.medical)} />
            )}
            {outcome.result.credits.donation > 0 && (
              <Row label="· 기부금" value={formatWon(outcome.result.credits.donation)} />
            )}
            <div className="flex justify-between border-t border-border-soft pt-2 text-accent-strong">
              <dt className="font-bold">결정세액</dt>
              <dd className="font-extrabold">{formatWon(outcome.result.determinedTax)}</dd>
            </div>
          </dl>

          <p className="mt-4 border-t border-border-soft pt-4 text-sm leading-relaxed text-muted">
            대표 공제만 반영한 간이 추정치입니다. 자녀·주택자금·월세·교육비
            세액공제와 신용카드 결제수단별 공제율(체크·현금 30%, 전통시장·대중교통
            40%)은 반영하지 않았습니다. 4대보험료 소득공제는 총급여 기준으로
            추정했습니다. 정확한 정산은 홈택스 연말정산 간소화·미리보기에서
            확인하세요.
          </p>
        </ResultCard>
      )}
    </section>
  );
}
