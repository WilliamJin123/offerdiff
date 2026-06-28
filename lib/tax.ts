// Income-tax estimation — federal (progressive, 2025 brackets), FICA, and an
// approximate per-state effective rate. Estimates only; not tax advice.

export type FilingStatus = "single" | "married";

interface Bracket {
  upTo: number;
  rate: number;
}

// 2025 federal brackets.
const FEDERAL: Record<FilingStatus, Bracket[]> = {
  single: [
    { upTo: 11925, rate: 0.1 },
    { upTo: 48475, rate: 0.12 },
    { upTo: 103350, rate: 0.22 },
    { upTo: 197300, rate: 0.24 },
    { upTo: 250525, rate: 0.32 },
    { upTo: 626350, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
  married: [
    { upTo: 23850, rate: 0.1 },
    { upTo: 96950, rate: 0.12 },
    { upTo: 206700, rate: 0.22 },
    { upTo: 394600, rate: 0.24 },
    { upTo: 501050, rate: 0.32 },
    { upTo: 751600, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
};

const STANDARD_DEDUCTION: Record<FilingStatus, number> = {
  single: 15000,
  married: 30000,
};

// FICA 2025.
const SS_WAGE_BASE = 176100;
const SS_RATE = 0.062;
const MEDICARE_RATE = 0.0145;
const ADDL_MEDICARE_RATE = 0.009;
const ADDL_MEDICARE_THRESHOLD: Record<FilingStatus, number> = {
  single: 200000,
  married: 250000,
};

/** Approximate effective state income-tax rates (applied flat to ordinary income). */
export const STATE_TAX_RATES: Record<string, number> = {
  AL: 0.045, AK: 0, AZ: 0.025, AR: 0.044, CA: 0.093, CO: 0.044, CT: 0.055,
  DE: 0.055, DC: 0.085, FL: 0, GA: 0.0539, HI: 0.08, ID: 0.058, IL: 0.0495,
  IN: 0.0315, IA: 0.05, KS: 0.052, KY: 0.04, LA: 0.0425, ME: 0.065, MD: 0.055,
  MA: 0.05, MI: 0.0425, MN: 0.068, MS: 0.044, MO: 0.048, MT: 0.059, NE: 0.052,
  NV: 0, NH: 0, NJ: 0.06, NM: 0.049, NY: 0.0625, NC: 0.045, ND: 0.025, OH: 0.035,
  OK: 0.0475, OR: 0.0875, PA: 0.0307, RI: 0.0475, SC: 0.064, SD: 0, TN: 0,
  TX: 0, UT: 0.0465, VT: 0.066, VA: 0.0575, WA: 0, WV: 0.051, WI: 0.053, WY: 0,
};

/** National-average effective state rate, used when no specific state is known. */
export const NATIONAL_STATE_RATE = 0.05;

export function stateRateForCode(code: string | undefined): number {
  if (!code) return NATIONAL_STATE_RATE;
  const rate = STATE_TAX_RATES[code.toUpperCase()];
  return rate === undefined ? NATIONAL_STATE_RATE : rate;
}

function progressive(income: number, brackets: Bracket[]): number {
  let tax = 0;
  let prev = 0;
  for (const b of brackets) {
    if (income <= prev) break;
    tax += (Math.min(income, b.upTo) - prev) * b.rate;
    prev = b.upTo;
  }
  return tax;
}

/** Federal income tax on gross ordinary income, after the standard deduction. */
export function federalIncomeTax(grossOrdinary: number, filing: FilingStatus): number {
  const taxable = Math.max(0, grossOrdinary - STANDARD_DEDUCTION[filing]);
  return progressive(taxable, FEDERAL[filing]);
}

/** FICA (Social Security + Medicare, incl. additional Medicare surtax) on wages. */
export function ficaTax(wages: number, filing: FilingStatus): number {
  const w = Math.max(0, wages);
  const ss = Math.min(w, SS_WAGE_BASE) * SS_RATE;
  const medicare = w * MEDICARE_RATE;
  const surtax = Math.max(0, w - ADDL_MEDICARE_THRESHOLD[filing]) * ADDL_MEDICARE_RATE;
  return ss + medicare + surtax;
}

export interface TaxBreakdown {
  federal: number;
  state: number;
  fica: number;
  total: number;
}

/** Total estimated income tax on ordinary income (salary + bonus + equity). */
export function estimateTax(
  ordinaryIncome: number,
  filing: FilingStatus,
  stateRate: number
): TaxBreakdown {
  const income = Math.max(0, ordinaryIncome);
  const federal = federalIncomeTax(income, filing);
  const fica = ficaTax(income, filing);
  const state = income * Math.max(0, stateRate);
  return { federal, state, fica, total: federal + state + fica };
}
