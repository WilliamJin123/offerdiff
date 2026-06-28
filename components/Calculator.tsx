"use client";

import { useMemo, useState } from "react";
import { compareOffers } from "@/lib/calc";
import { formToInput, resolveColIndex, resolveMonthlyRent, type OfferForm } from "@/lib/form";
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
  baseSalary: "145000",
  bonus: "10000",
  equity: "20000",
  benefits: "12000",
  commuteMinutes: "15",
  remoteDays: 3,
  city: "Austin, TX",
  customIndex: "",
  monthlyRent: "",
};

export default function Calculator() {
  const [a, setA] = useState<OfferForm>(defaultA);
  const [b, setB] = useState<OfferForm>(defaultB);

  const result = useMemo(() => compareOffers(formToInput(a), formToInput(b)), [a, b]);
  const aMeta = useMemo(
    () => ({ rentAssumed: resolveMonthlyRent(a).assumed, index: resolveColIndex(a) }),
    [a]
  );
  const bMeta = useMemo(
    () => ({ rentAssumed: resolveMonthlyRent(b).assumed, index: resolveColIndex(b) }),
    [b]
  );

  return (
    <div className="flex flex-col gap-5">
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
      />
    </div>
  );
}
