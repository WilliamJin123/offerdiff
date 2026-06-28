// OfferDiff calculation engine — pure, deterministic, unit-tested.
//
// Model (kept deliberately simple and transparent for v1):
//   grossComp   = base + bonus + equity + benefits           (annual $)
//   commuteCost = commute hours/yr valued at HALF hourly wage (annual $)
//   netNominal  = grossComp - commuteCost
//   adjusted    = netNominal * (100 / colIndex)               (purchasing power)
//
// Every assumption below is surfaced in the UI breakdown so the headline number
// is never a black box.

/** Working weeks per year, after ~4 weeks of vacation/holidays. */
export const WORKING_WEEKS_PER_YEAR = 48;

/** Full-time hours per year (40h × 52w) used to derive an hourly wage from base. */
export const HOURS_PER_YEAR_FULL_TIME = 2080;

/** Commute time is valued at this fraction of hourly wage (a partial, not total, loss). */
export const COMMUTE_TIME_VALUE_FACTOR = 0.5;

export interface OfferInput {
  /** Annual base salary, $. */
  baseSalary: number;
  /** Annual bonus, $. */
  bonus: number;
  /** Annual equity value (simple $/yr), $. */
  equity: number;
  /** Annual value of benefits (401k match, health premium coverage, etc.), $. */
  benefits: number;
  /** One-way commute time, minutes. */
  commuteMinutes: number;
  /** Days per week worked remotely (0–5). */
  remoteDays: number;
  /** Cost-of-living index, national average = 100. */
  colIndex: number;
}

export interface OfferBreakdown {
  grossComp: number;
  inOfficeDays: number;
  hourlyWage: number;
  annualCommuteHours: number;
  commuteCost: number;
  netNominal: number;
  colFactor: number;
  adjustedValue: number;
}

export interface ComparisonResult {
  a: OfferBreakdown;
  b: OfferBreakdown;
  /** adjustedA - adjustedB (signed: positive means A is worth more). */
  difference: number;
  absDifference: number;
  winner: "A" | "B" | "tie";
}

/** Coerce to a finite, non-negative number (blank/NaN/Infinity/negative → 0). */
function money(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export function computeOffer(input: OfferInput): OfferBreakdown {
  const base = money(input.baseSalary);
  const grossComp = base + money(input.bonus) + money(input.equity) + money(input.benefits);

  const inOfficeDays = 5 - clamp(input.remoteDays, 0, 5);
  const commuteMinutes = money(input.commuteMinutes);
  const dailyRoundTripHours = (commuteMinutes * 2) / 60;
  const annualCommuteHours = inOfficeDays * WORKING_WEEKS_PER_YEAR * dailyRoundTripHours;

  const hourlyWage = base / HOURS_PER_YEAR_FULL_TIME;
  const commuteCost = annualCommuteHours * hourlyWage * COMMUTE_TIME_VALUE_FACTOR;

  const netNominal = grossComp - commuteCost;

  // Guard against a zero/negative index; fall back to the national average.
  const safeIndex = input.colIndex > 0 ? input.colIndex : 100;
  const colFactor = 100 / safeIndex;
  const adjustedValue = netNominal * colFactor;

  return {
    grossComp,
    inOfficeDays,
    hourlyWage,
    annualCommuteHours,
    commuteCost,
    netNominal,
    colFactor,
    adjustedValue,
  };
}

export function compareOffers(aInput: OfferInput, bInput: OfferInput): ComparisonResult {
  const a = computeOffer(aInput);
  const b = computeOffer(bInput);
  const difference = a.adjustedValue - b.adjustedValue;
  const absDifference = Math.abs(difference);
  const winner: ComparisonResult["winner"] =
    Math.round(difference) === 0 ? "tie" : difference > 0 ? "A" : "B";

  return { a, b, difference, absDifference, winner };
}
