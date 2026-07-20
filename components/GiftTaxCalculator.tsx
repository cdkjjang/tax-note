"use client";

import { useState } from "react";
import { MoneyField, ResultCard, Row, parseMoney } from "./fields";
import { formatWon, formatKoreanMoney } from "@/lib/date";
import {
  RELATION_DEDUCTION,
  RELATION_LABEL,
  calcGiftTax,
  type GiftRelation,
} from "@/lib/gift-tax";

const MAN = 10_000;
const RELATIONS = Object.keys(RELATION_LABEL) as GiftRelation[];

const selectClass =
  "w-full rounded-xl border border-border-soft bg-card px-4 py-2.5 text-[15px] outline-none transition-colors focus:border-accent";

export default function GiftTaxCalculator() {
  const [amount, setAmount] = useState(""); // 증여액, 만원
  const [relation, setRelation] = useState<GiftRelation>("linealAdult");
  const [marriage, setMarriage] = useState(false);

  const amountMan = parseMoney(amount);
  const ready = amountMan !== null && amountMan > 0;
  const eligibleForMarriage =
    relation === "linealAdult" || relation === "linealMinor";

  const outcome = ready
    ? calcGiftTax({
        giftAmount: amountMan * MAN,
        relation,
        marriageBirth: marriage && eligibleForMarriage,
      })
    : null;

  return (
    <section className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
      <MoneyField
        label="증여재산가액"
        hint="이번에 증여받는 금액"
        unit="만원"
        value={amount}
        onChange={setAmount}
        placeholder="예: 10000 (1억)"
      />

      <label className="mb-5 block">
        <span className="mb-1.5 block font-bold">증여자와의 관계</span>
        <select
          className={selectClass}
          value={relation}
          onChange={(e) => setRelation(e.target.value as GiftRelation)}
        >
          {RELATIONS.map((r) => (
            <option key={r} value={r}>
              {RELATION_LABEL[r]} — 공제 {formatKoreanMoney(RELATION_DEDUCTION[r])}
            </option>
          ))}
        </select>
      </label>

      {eligibleForMarriage && (
        <label className="mb-5 flex items-center gap-2.5">
          <input
            type="checkbox"
            checked={marriage}
            onChange={(e) => setMarriage(e.target.checked)}
            className="h-5 w-5 accent-[var(--accent)]"
          />
          <span className="text-[15px]">
            혼인·출산 증여재산공제 적용{" "}
            <span className="text-xs text-muted">(직계존속 증여, 추가 1억)</span>
          </span>
        </label>
      )}

      {!ready && (
        <p className="text-sm text-muted">증여액을 입력하면 바로 계산됩니다.</p>
      )}

      {outcome && outcome.ok && (
        <ResultCard title="예상 증여세 (신고세액공제 3% 반영)">
          <p className="text-3xl font-extrabold text-accent-strong">
            {formatWon(outcome.result.payableTax)}
          </p>
          {outcome.result.taxBase > 0 ? (
            <p className="mt-1 text-sm text-muted">
              과세표준 {formatWon(outcome.result.taxBase)} · 적용세율{" "}
              {outcome.result.ratePct}%
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted">
              공제 범위 안이라 납부할 증여세가 없습니다.
            </p>
          )}

          <dl className="mt-4 space-y-1.5 border-t border-border-soft pt-4 text-[15px]">
            <Row label="증여재산공제" value={formatWon(outcome.result.relationDeduction)} />
            {outcome.result.marriageDeduction > 0 && (
              <Row label="혼인·출산 공제" value={formatWon(outcome.result.marriageDeduction)} />
            )}
            <Row label="과세표준" value={formatWon(outcome.result.taxBase)} />
            <Row label="산출세액" value={formatWon(outcome.result.calculatedTax)} />
            <Row label="신고세액공제 (3%)" value={`−${formatWon(outcome.result.filingCredit)}`} />
            <div className="flex justify-between border-t border-border-soft pt-2 text-accent-strong">
              <dt className="font-bold">납부세액</dt>
              <dd className="font-extrabold">{formatWon(outcome.result.payableTax)}</dd>
            </div>
          </dl>

          <p className="mt-4 border-t border-border-soft pt-4 text-sm leading-relaxed text-muted">
            증여재산공제는 같은 증여자에게서 10년간 받은 금액을 합산해 적용됩니다.
            과거 10년 내 증여가 있으면 합산되어 세액이 커집니다. 세대를 건너뛴
            증여(조부모→손자녀)는 30~40% 할증이 붙으며, 이 계산기는 반영하지
            않습니다. 신고·납부는 증여일이 속한 달의 말일부터 3개월 이내입니다.
          </p>
        </ResultCard>
      )}
    </section>
  );
}
