import type { OfferForm } from "./form";
import type { FilingStatus } from "./tax";

export interface CompareState {
  a: OfferForm;
  b: OfferForm;
  filing: FilingStatus;
}

// Compact key map: form field -> short URL code.
const FIELDS: Array<[keyof OfferForm, string]> = [
  ["label", "l"],
  ["baseSalary", "s"],
  ["bonus", "bo"],
  ["equity", "e"],
  ["benefits", "be"],
  ["commuteMinutes", "c"],
  ["remoteDays", "r"],
  ["city", "ci"],
  ["customIndex", "x"],
  ["monthlyRent", "rt"],
];

/** Serialize a comparison into a compact URL query string. */
export function encodeState(state: CompareState): string {
  const p = new URLSearchParams();
  (["a", "b"] as const).forEach((side) => {
    const form = state[side];
    for (const [field, code] of FIELDS) {
      const value = String(form[field] ?? "");
      if (value !== "") p.set(`${side}${code}`, value);
    }
  });
  p.set("fs", state.filing);
  return p.toString();
}

/** Rebuild a comparison from a URL query string, falling back to defaults for anything absent. */
export function decodeState(search: string, defaults: CompareState): CompareState {
  const p = new URLSearchParams(search);
  if ([...p.keys()].length === 0) return defaults;

  const build = (side: "a" | "b", base: OfferForm): OfferForm => {
    const next = { ...base };
    for (const [field, code] of FIELDS) {
      const raw = p.get(`${side}${code}`);
      if (raw === null) continue;
      if (field === "remoteDays") {
        const n = Number(raw);
        next.remoteDays = Number.isFinite(n) ? Math.min(5, Math.max(0, Math.round(n))) : base.remoteDays;
      } else {
        (next[field] as string) = raw;
      }
    }
    return next;
  };

  const fs = p.get("fs");
  return {
    a: build("a", defaults.a),
    b: build("b", defaults.b),
    filing: fs === "married" ? "married" : "single",
  };
}
