// OfferDiff calculation engine — pure, deterministic, unit-tested.
//
// Model: estimate the money each offer actually leaves you per year, after the
// big location-driven costs, then compare.
//
//   grossComp   = base + bonus + equity + benefits            (annual $)
//   commuteCost = commute hours/yr valued at HALF hourly wage  (annual $)
//   housingCost = monthly rent × 12 (entered, or assumed)      (annual $)
//   livingCost  = non-housing essentials, scaled by COL index  (annual $)
//   leftover    = grossComp − commuteCost − housingCost − livingCost
//
// Every line is surfaced in the UI ledger so the headline is never a black box.

/** Working weeks per year, after ~4 weeks of vacation/holidays. */
export const WORKING_WEEKS_PER_YEAR = 48;

/** Full-time hours per year (40h × 52w) used to derive an hourly wage from base. */
export const HOURS_PER_YEAR_FULL_TIME = 2080;

/** Commute time is valued at this fraction of hourly wage (a partial, not total, loss). */
export const COMMUTE_TIME_VALUE_FACTOR = 0.5;

/** National-average annual non-housing essentials (food, transport, utilities, etc.). */
export const NONHOUSING_BASELINE = 22000;

const MONTHS_PER_YEAR = 12;

export interface OfferInput {
  baseSalary: number;
  bonus: number;
  equity: number;
  benefits: number;
  commuteMinutes: number;
  remoteDays: number;
  /** Monthly housing cost, $ (already resolved to entered-or-assumed by the form). */
  monthlyRent: number;
  /** Cost-of-living index, national average = 100 (scales non-housing living cost). */
  colIndex: number;
}

export interface OfferBreakdown {
  grossComp: number;
  inOfficeDays: number;
  hourlyWage: number;
  annualCommuteHours: number;
  commuteCost: number;
  housingCost: number;
  livingCost: number;
  leftover: number;
}

export interface ComparisonResult {
  a: OfferBreakdown;
  b: OfferBreakdown;
  /** leftoverA - leftoverB (signed: positive means A leaves you more). */
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

  const housingCost = money(input.monthlyRent) * MONTHS_PER_YEAR;

  const safeIndex = input.colIndex > 0 ? input.colIndex : 100;
  const livingCost = NONHOUSING_BASELINE * (safeIndex / 100);

  const leftover = grossComp - commuteCost - housingCost - livingCost;

  return {
    grossComp,
    inOfficeDays,
    hourlyWage,
    annualCommuteHours,
    commuteCost,
    housingCost,
    livingCost,
    leftover,
  };
}

export function compareOffers(aInput: OfferInput, bInput: OfferInput): ComparisonResult {
  const a = computeOffer(aInput);
  const b = computeOffer(bInput);
  const difference = a.leftover - b.leftover;
  const absDifference = Math.abs(difference);
  const winner: ComparisonResult["winner"] =
    Math.round(difference) === 0 ? "tie" : difference > 0 ? "A" : "B";

  return { a, b, difference, absDifference, winner };
}
