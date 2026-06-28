"use client";

import type { ComparisonResult } from "@/lib/calc";
import { formatUSD } from "@/lib/format";

interface Props {
  result: ComparisonResult;
  labelA: string;
  labelB: string;
  indexA: number;
  indexB: number;
}

export default function ResultCard({ result, labelA, labelB, indexA, indexB }: Props) {
  const { a, b, winner, absDifference } = result;
  const winnerLabel = winner === "A" ? labelA : winner === "B" ? labelB : null;

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 sm:p-8">
      {/* Headline */}
      <div className="text-center">
        {winner === "tie" ? (
          <p className="text-2xl font-semibold text-slate-100 sm:text-3xl">
            It&apos;s basically a wash.
          </p>
        ) : (
          <>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
              {winnerLabel} is worth about
            </p>
            <p className="mt-1 text-4xl font-bold text-emerald-400 sm:text-5xl">
              {formatUSD(absDifference)}
              <span className="text-2xl font-semibold text-emerald-400/80 sm:text-3xl">
                {" "}
                more / year
              </span>
            </p>
            <p className="mt-1 text-sm text-slate-400">adjusted for commute, remote work &amp; cost of living</p>
          </>
        )}
      </div>

      {/* Breakdown */}
      <div className="mt-7 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5 text-left text-slate-400">
              <th className="px-4 py-2.5 font-medium">Breakdown</th>
              <th className="px-4 py-2.5 text-right font-semibold text-indigo-300">{labelA}</th>
              <th className="px-4 py-2.5 text-right font-semibold text-amber-300">{labelB}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <Row label="Gross comp / year" aValue={formatUSD(a.grossComp)} bValue={formatUSD(b.grossComp)} />
            <Row
              label="Commute cost"
              sub={`${Math.round(a.annualCommuteHours)} vs ${Math.round(b.annualCommuteHours)} hrs/yr`}
              aValue={a.commuteCost > 0 ? `−${formatUSD(a.commuteCost)}` : "—"}
              bValue={b.commuteCost > 0 ? `−${formatUSD(b.commuteCost)}` : "—"}
              muted
            />
            <Row
              label="Cost-of-living"
              sub={`index ${Math.round(indexA)} vs ${Math.round(indexB)} (avg = 100)`}
              aValue={`×${a.colFactor.toFixed(2)}`}
              bValue={`×${b.colFactor.toFixed(2)}`}
              muted
            />
            <tr className="bg-white/[0.04]">
              <td className="px-4 py-3 font-semibold text-slate-200">Adjusted value / year</td>
              <td className="px-4 py-3 text-right text-base font-bold text-indigo-200">
                {formatUSD(a.adjustedValue)}
              </td>
              <td className="px-4 py-3 text-right text-base font-bold text-amber-200">
                {formatUSD(b.adjustedValue)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        Commute time is valued at 50% of your hourly wage ({" "}
        <span className="text-slate-400">base ÷ 2,080 hrs</span>), over 48 working weeks. Cost-of-living
        adjusts each offer to equal purchasing power (national average = 100). Estimates only — not
        financial advice.
      </p>
    </div>
  );
}

function Row({
  label,
  sub,
  aValue,
  bValue,
  muted,
}: {
  label: string;
  sub?: string;
  aValue: string;
  bValue: string;
  muted?: boolean;
}) {
  const valueColor = muted ? "text-slate-400" : "text-slate-200";
  return (
    <tr>
      <td className="px-4 py-3">
        <div className="text-slate-300">{label}</div>
        {sub && <div className="text-xs text-slate-500">{sub}</div>}
      </td>
      <td className={`px-4 py-3 text-right tabular-nums ${valueColor}`}>{aValue}</td>
      <td className={`px-4 py-3 text-right tabular-nums ${valueColor}`}>{bValue}</td>
    </tr>
  );
}
