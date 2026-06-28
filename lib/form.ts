import { CITIES, NATIONAL_AVERAGE_INDEX } from "./col";
import type { OfferInput } from "./calc";
import { parseField } from "./format";

export const NATIONAL = "__national__";
export const CUSTOM = "__custom__";

/** UI form state for a single offer. Money fields are strings so they can be blank. */
export interface OfferForm {
  label: string;
  baseSalary: string;
  bonus: string;
  equity: string;
  benefits: string;
  commuteMinutes: string;
  remoteDays: number;
  /** City name from the COL table, or NATIONAL / CUSTOM sentinel. */
  city: string;
  /** Used only when city === CUSTOM. */
  customIndex: string;
}

const CITY_INDEX = new Map(CITIES.map((c) => [c.name, c.index]));

/** Resolve the cost-of-living index for a form's city selection. */
export function resolveColIndex(form: OfferForm): number {
  if (form.city === NATIONAL) return NATIONAL_AVERAGE_INDEX;
  if (form.city === CUSTOM) {
    const parsed = parseField(form.customIndex);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : NATIONAL_AVERAGE_INDEX;
  }
  return CITY_INDEX.get(form.city) ?? NATIONAL_AVERAGE_INDEX;
}

/** Convert UI form state into the numeric input the calc engine expects. */
export function formToInput(form: OfferForm): OfferInput {
  return {
    baseSalary: parseField(form.baseSalary),
    bonus: parseField(form.bonus),
    equity: parseField(form.equity),
    benefits: parseField(form.benefits),
    commuteMinutes: parseField(form.commuteMinutes),
    remoteDays: form.remoteDays,
    colIndex: resolveColIndex(form),
  };
}
