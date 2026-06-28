"use client";

import type { ComparisonResult, FilingStatus } from "@/lib/calc";
import { formatUSD } from "@/lib/format";

interface OfferMeta {
  rentAssumed: boolean;
  index: number;
  stateRate: number;
}

interface Props {
  result: ComparisonResult;
  labelA: string;
  labelB: string;
  aMeta: OfferMeta;
  bMeta: OfferMeta;
  filing: FilingStatus;
}

export default function ResultCard({ result, labelA, labelB, aMeta, bMeta, filing }: Props) {
  const { a, b, winner, absDifference } = result;
  const winnerLabel = winner === "A" ? labelA : winner === "B" ? labelB : null;
  const filingLabel = filing === "married" ? "married filing jointly" : "single filer";

  return (
    <div className="border border-line-strong bg-paper-raised">
      <div className="border-b border-line px-6 py-7 text-center sm:px-10 sm:py-9">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3">The verdict</p>
        {winner === "tie" ? (
          <p className="mt-3 font-display text-3xl font-medium text-ink">It&apos;s a wash.</p>
        ) : (
          <>
            <p className="mt-2 font-display text-xl font-medium text-ink sm:text-2xl">
              {winnerLabel} leaves you
            </p>
            <p className="mt-1 font-mono text-5xl font-semibold tracking-tight text-money sm:text-6xl">
              +{formatUSD(absDifference)}
            </p>
            <p className="mt-2 text-sm text-ink-2">
              more per year · after tax, rent &amp; living costs
            </p>
          </>
        )}
      </div>

      <div className="px-3 py-2 sm:px-6 sm:py-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="py-3 pl-3 text-left font-mono text-[11px] uppercase tracking-[0.15em] text-ink-3">
                Per year
              </th>
              <th className="py-3 pr-3 text-right font-display text-base font-medium text-offer-a">{labelA}</th>
              <th className="py-3 pr-3 text-right font-display text-base font-medium text-offer-b">{labelB}</th>
            </tr>
          </thead>
          <tbody>
            <LedgerRow label="Gross comp" sub="salary + bonus + equity" aValue={formatUSD(a.grossComp)} bValue={formatUSD(b.grossComp)} />
            <LedgerRow
              label="Income tax"
              sub="federal + state + FICA"
              aValue={`−${formatUSD(a.tax.total)}`}
              bValue={`−${formatUSD(b.tax.total)}`}
              muted
            />
            <LedgerRow
              label="Benefits"
              sub="untaxed value"
              aValue={a.benefits > 0 ? `+${formatUSD(a.benefits)}` : "—"}
              bValue={b.benefits > 0 ? `+${formatUSD(b.benefits)}` : "—"}
              muted
            />
            <LedgerRow
              label="Commute cost"
              sub={`${Math.round(a.annualCommuteHours)} vs ${Math.round(b.annualCommuteHours)} hrs/yr`}
              aValue={a.commuteCost > 0 ? `−${formatUSD(a.commuteCost)}` : "—"}
              bValue={b.commuteCost > 0 ? `−${formatUSD(b.commuteCost)}` : "—"}
              muted
            />
            <LedgerRow
              label="Housing (rent)"
              aValue={`−${formatUSD(a.housingCost)}`}
              bValue={`−${formatUSD(b.housingCost)}`}
              aTag={aMeta.rentAssumed ? "city avg" : "your rent"}
              bTag={bMeta.rentAssumed ? "city avg" : "your rent"}
              muted
            />
            <LedgerRow
              label="Living costs"
              sub={`est. · COL ${Math.round(aMeta.index)} vs ${Math.round(bMeta.index)}`}
              aValue={`−${formatUSD(a.livingCost)}`}
              bValue={`−${formatUSD(b.livingCost)}`}
              muted
            />
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-ink">
              <td className="py-4 pl-3 font-display text-[15px] font-medium text-ink">Money left over</td>
              <Total value={a.leftover} won={winner === "A"} accent="text-offer-a" />
              <Total value={b.leftover} won={winner === "B"} accent="text-offer-b" />
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="border-t border-line px-6 py-4 text-[12px] leading-relaxed text-ink-3 sm:px-10">
        Tax estimated for a {filingLabel} (2025 federal brackets + FICA + approximate state rate);
        benefits are treated as untaxed value. Commute time valued at 50% of hourly wage. Housing uses
        your rent or the city average; living costs estimate non-housing essentials by cost-of-living
        index. Estimates only — not financial or tax advice.
      </p>
    </div>
  );
}

function LedgerRow({
  label,
  sub,
  aValue,
  bValue,
  aTag,
  bTag,
  muted,
}: {
  label: string;
  sub?: string;
  aValue: string;
  bValue: string;
  aTag?: string;
  bTag?: string;
  muted?: boolean;
}) {
  const color = muted ? "text-ink-2" : "text-ink";
  return (
    <tr className="border-b border-line/70">
      <td className="py-3 pl-3 align-top">
        <div className="text-ink">{label}</div>
        {sub && <div className="text-[12px] text-ink-3">{sub}</div>}
      </td>
      <ValueCell value={aValue} tag={aTag} color={color} />
      <ValueCell value={bValue} tag={bTag} color={color} />
    </tr>
  );
}

function ValueCell({ value, tag, color }: { value: string; tag?: string; color: string }) {
  return (
    <td className="py-3 pr-3 text-right align-top">
      <div className={`font-mono tabular-nums ${color}`}>{value}</div>
      {tag && <div className="text-[11px] text-ink-3">{tag}</div>}
    </td>
  );
}

function Total({ value, won, accent }: { value: number; won: boolean; accent: string }) {
  const isNeg = value < 0;
  const color = won ? "text-money" : isNeg ? "text-loss" : accent;
  return (
    <td className="py-4 pr-3 text-right">
      <span className={`font-mono text-lg font-semibold tabular-nums ${color}`}>
        {formatUSD(value, { signed: isNeg })}
      </span>
      {won && <span className="ml-1.5 align-middle font-mono text-[11px] text-money">✓</span>}
    </td>
  );
}
