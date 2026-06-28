"use client";

import { useEffect, useMemo, useState } from "react";
import { track } from "@vercel/analytics";
import { compareOffers, type FilingStatus } from "@/lib/calc";
import { formToInput, resolveColIndex, resolveMonthlyRent, resolveStateRate, type OfferForm } from "@/lib/form";
import { encodeState, decodeState, type CompareState } from "@/lib/share";
import OfferColumn from "./OfferColumn";
import ResultCard from "./ResultCard";

const defaultA: OfferForm = {
  label: "Offer A",
  baseSalary: "165000",
  bonus: "15000",
  equity: "40000",
  benefits: "12000",
  commuteMinutes: "35",
  remoteDays: 2,
  city: "San Francisco, CA",
  customIndex: "",
  monthlyRent: "",
};

const defaultB: OfferForm = {
  label: "Offer B",
  baseSalary: "155000",
  bonus: "10000",
  equity: "20000",
  benefits: "12000",
  commuteMinutes: "15",
  remoteDays: 3,
  city: "Austin, TX",
  customIndex: "",
  monthlyRent: "",
};

const defaults: CompareState = { a: defaultA, b: defaultB, filing: "single" };

export default function Calculator() {
  const [a, setA] = useState<OfferForm>(defaultA);
  const [b, setB] = useState<OfferForm>(defaultB);
  const [filing, setFiling] = useState<FilingStatus>("single");
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState(false);

  // Hydrate from a shared URL once, on mount (keeps SSR markup = defaults).
  useEffect(() => {
    const d = decodeState(window.location.search, defaults);
    setA(d.a);
    setB(d.b);
    setFiling(d.filing);
    setHydrated(true);
  }, []);

  // Keep the URL in sync so "Copy link" always shares the current comparison.
  useEffect(() => {
    if (!hydrated) return;
    const qs = encodeState({ a, b, filing });
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [a, b, filing, hydrated]);

  const result = useMemo(
    () => compareOffers(formToInput(a), formToInput(b), filing),
    [a, b, filing]
  );
  const aMeta = useMemo(
    () => ({ rentAssumed: resolveMonthlyRent(a).assumed, index: resolveColIndex(a), stateRate: resolveStateRate(a) }),
    [a]
  );
  const bMeta = useMemo(
    () => ({ rentAssumed: resolveMonthlyRent(b).assumed, index: resolveColIndex(b), stateRate: resolveStateRate(b) }),
    [b]
  );

  async function copyLink() {
    const qs = encodeState({ a, b, filing });
    const url = `${window.location.origin}${window.location.pathname}${qs ? `?${qs}` : ""}`;
    try {
      await navigator.clipboard.writeText(url);
      track("share_copied");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  function reset() {
    setA(defaultA);
    setB(defaultB);
    setFiling("single");
  }

  const toolBtn =
    "rounded-md border border-line-strong px-3 py-1.5 text-[13px] font-medium text-ink-2 transition hover:border-ink hover:text-ink";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-[13px] text-ink-2">
          <span className="font-medium">Filing status</span>
          <select
            value={filing}
            onChange={(e) => setFiling(e.target.value as FilingStatus)}
            className="rounded-md border border-line bg-white px-2.5 py-1.5 text-ink outline-none transition focus:border-money focus:ring-2 focus:ring-money/20"
          >
            <option value="single">Single</option>
            <option value="married">Married, filing jointly</option>
          </select>
        </label>
        <div className="flex items-center gap-2">
          <button type="button" onClick={copyLink} className={toolBtn}>
            {copied ? "Link copied ✓" : "Copy link"}
          </button>
          <button type="button" onClick={reset} className={toolBtn}>
            Reset
          </button>
        </div>
      </div>

      <div className="relative border border-line-strong bg-paper-raised">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-5 sm:p-7">
            <OfferColumn form={a} which="a" onChange={(patch) => setA((f) => ({ ...f, ...patch }))} />
          </div>
          <div className="border-t border-line p-5 sm:border-l sm:border-t-0 sm:p-7">
            <OfferColumn form={b} which="b" onChange={(patch) => setB((f) => ({ ...f, ...patch }))} />
          </div>
        </div>
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-paper font-mono text-xs lowercase tracking-wide text-ink-3 md:flex"
        >
          vs
        </span>
      </div>

      <ResultCard
        result={result}
        labelA={a.label || "Offer A"}
        labelB={b.label || "Offer B"}
        aMeta={aMeta}
        bMeta={bMeta}
        filing={filing}
      />
    </div>
  );
}
