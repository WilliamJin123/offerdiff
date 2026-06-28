import { CITIES, NATIONAL_AVERAGE_INDEX, NATIONAL_AVERAGE_RENT } from "./col";
import type { OfferInput } from "./calc";
import { stateRateForCode, NATIONAL_STATE_RATE } from "./tax";
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
  /** Optional monthly rent override; blank → assume the city's typical rent. */
  monthlyRent: string;
}

const CITY = new Map(CITIES.map((c) => [c.name, c]));

/** Resolve the cost-of-living index for a form's city selection. */
export function resolveColIndex(form: OfferForm): number {
  if (form.city === NATIONAL) return NATIONAL_AVERAGE_INDEX;
  if (form.city === CUSTOM) {
    const parsed = parseField(form.customIndex);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : NATIONAL_AVERAGE_INDEX;
  }
  return CITY.get(form.city)?.index ?? NATIONAL_AVERAGE_INDEX;
}

/** The assumed monthly rent for a form's city (the default when the user leaves rent blank). */
export function assumedRent(form: OfferForm): number {
  if (form.city === NATIONAL || form.city === CUSTOM) return NATIONAL_AVERAGE_RENT;
  return CITY.get(form.city)?.rent ?? NATIONAL_AVERAGE_RENT;
}

/** Resolve monthly rent: the user's entry if present, otherwise the assumed city rent. */
export function resolveMonthlyRent(form: OfferForm): { value: number; assumed: boolean } {
  const parsed = parseField(form.monthlyRent);
  if (Number.isFinite(parsed) && parsed >= 0 && form.monthlyRent.trim() !== "") {
    return { value: parsed, assumed: false };
  }
  return { value: assumedRent(form), assumed: true };
}

/** Effective state income-tax rate for a form's city (national average if unknown). */
export function resolveStateRate(form: OfferForm): number {
  if (form.city === NATIONAL || form.city === CUSTOM) return NATIONAL_STATE_RATE;
  return stateRateForCode(CITY.get(form.city)?.state);
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
    monthlyRent: resolveMonthlyRent(form).value,
    colIndex: resolveColIndex(form),
    stateTaxRate: resolveStateRate(form),
  };
}
