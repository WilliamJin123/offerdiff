"use client";

import { useMemo, useState } from "react";
import { compareOffers } from "@/lib/calc";
import { formToInput, resolveColIndex, type OfferForm } from "@/lib/form";
import OfferColumn from "./OfferColumn";
import ResultCard from "./ResultCard";

const offerA: OfferForm = {
  label: "Offer A",
  baseSalary: "165000",
  bonus: "15000",
  equity: "40000",
  benefits: "12000",
  commuteMinutes: "35",
  remoteDays: 2,
  city: "San Francisco, CA",
  customIndex: "",
};

const offerB: OfferForm = {
  label: "Offer B",
  baseSalary: "145000",
  bonus: "10000",
  equity: "20000",
  benefits: "12000",
  commuteMinutes: "15",
  remoteDays: 3,
  city: "Austin, TX",
  customIndex: "",
};

export default function Calculator() {
  const [a, setA] = useState<OfferForm>(offerA);
  const [b, setB] = useState<OfferForm>(offerB);

  const result = useMemo(() => compareOffers(formToInput(a), formToInput(b)), [a, b]);
  const indexA = useMemo(() => resolveColIndex(a), [a]);
  const indexB = useMemo(() => resolveColIndex(b), [b]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <OfferColumn form={a} accent="indigo" onChange={(patch) => setA((f) => ({ ...f, ...patch }))} />
        <OfferColumn form={b} accent="amber" onChange={(patch) => setB((f) => ({ ...f, ...patch }))} />
      </div>
      <ResultCard
        result={result}
        labelA={a.label || "Offer A"}
        labelB={b.label || "Offer B"}
        indexA={indexA}
        indexB={indexB}
      />
    </div>
  );
}
