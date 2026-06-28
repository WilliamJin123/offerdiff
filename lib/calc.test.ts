import { describe, it, expect } from "vitest";
import {
  computeOffer,
  compareOffers,
  WORKING_WEEKS_PER_YEAR,
  HOURS_PER_YEAR_FULL_TIME,
  COMMUTE_TIME_VALUE_FACTOR,
  NONHOUSING_BASELINE,
  type OfferInput,
} from "./calc";
import { estimateTax } from "./tax";

const blank: OfferInput = {
  baseSalary: 0,
  bonus: 0,
  equity: 0,
  benefits: 0,
  commuteMinutes: 0,
  remoteDays: 0,
  monthlyRent: 0,
  colIndex: 100,
  stateTaxRate: 0,
};

describe("computeOffer — taxable gross comp", () => {
  it("sums base, bonus, and equity (benefits are NOT taxable income)", () => {
    const r = computeOffer(
      { ...blank, baseSalary: 100000, bonus: 15000, equity: 20000, benefits: 5000 },
      "single"
    );
    expect(r.grossComp).toBe(135000);
    expect(r.benefits).toBe(5000);
  });
});

describe("computeOffer — tax & after-tax", () => {
  it("subtracts federal + state + FICA to get after-tax income", () => {
    const r = computeOffer({ ...blank, baseSalary: 150000, stateTaxRate: 0.093 }, "single");
    const expected = estimateTax(150000, "single", 0.093);
    expect(r.tax.total).toBeCloseTo(expected.total, 2);
    expect(r.afterTax).toBeCloseTo(150000 - expected.total, 2);
  });

  it("a no-tax state yields higher after-tax than a high-tax state", () => {
    const tx = computeOffer({ ...blank, baseSalary: 150000, stateTaxRate: 0 }, "single");
    const ca = computeOffer({ ...blank, baseSalary: 150000, stateTaxRate: 0.093 }, "single");
    expect(tx.afterTax).toBeGreaterThan(ca.afterTax);
  });
});

describe("computeOffer — commute cost", () => {
  it("values commute time at 50% of hourly wage", () => {
    const r = computeOffer({ ...blank, baseSalary: 104000, commuteMinutes: 30 }, "single");
    expect(r.hourlyWage).toBe(50);
    expect(r.inOfficeDays).toBe(5);
    expect(r.annualCommuteHours).toBe(240);
    expect(r.commuteCost).toBe(6000);
  });

  it("remote days reduce in-office days and commute cost", () => {
    const full = computeOffer({ ...blank, baseSalary: 104000, commuteMinutes: 30, remoteDays: 0 }, "single");
    const hybrid = computeOffer({ ...blank, baseSalary: 104000, commuteMinutes: 30, remoteDays: 2 }, "single");
    expect(hybrid.inOfficeDays).toBe(3);
    expect(hybrid.commuteCost).toBeCloseTo(full.commuteCost * (3 / 5), 6);
  });

  it("uses the documented constants", () => {
    expect(WORKING_WEEKS_PER_YEAR).toBe(48);
    expect(HOURS_PER_YEAR_FULL_TIME).toBe(2080);
    expect(COMMUTE_TIME_VALUE_FACTOR).toBe(0.5);
    expect(NONHOUSING_BASELINE).toBe(22000);
  });
});

describe("computeOffer — housing & living", () => {
  it("annualizes monthly rent", () => {
    expect(computeOffer({ ...blank, monthlyRent: 2500 }, "single").housingCost).toBe(30000);
  });

  it("scales the non-housing baseline by the COL index", () => {
    expect(computeOffer({ ...blank, colIndex: 150 }, "single").livingCost).toBe(33000);
  });

  it("guards a zero/negative index (falls back to national average)", () => {
    expect(computeOffer({ ...blank, colIndex: 0 }, "single").livingCost).toBe(22000);
  });
});

describe("computeOffer — leftover", () => {
  it("is after-tax + benefits − commute − housing − living", () => {
    const input: OfferInput = {
      ...blank,
      baseSalary: 100000,
      bonus: 20000,
      equity: 30000,
      benefits: 4000,
      commuteMinutes: 30,
      monthlyRent: 2000,
      colIndex: 120,
      stateTaxRate: 0.05,
    };
    const r = computeOffer(input, "single");
    const tax = estimateTax(150000, "single", 0.05);
    const afterTax = 150000 - tax.total;
    const commute = 240 * (100000 / 2080) * 0.5;
    const expected = afterTax + 4000 - commute - 24000 - 26400;
    expect(r.grossComp).toBe(150000);
    expect(r.leftover).toBeCloseTo(expected, 2);
  });
});

describe("computeOffer — input sanitization", () => {
  it("clamps remoteDays to 0..5", () => {
    expect(computeOffer({ ...blank, remoteDays: 9 }, "single").inOfficeDays).toBe(0);
    expect(computeOffer({ ...blank, remoteDays: -3 }, "single").inOfficeDays).toBe(5);
  });

  it("treats NaN / non-finite / negative money as 0", () => {
    const r = computeOffer({ ...blank, baseSalary: NaN, bonus: Infinity, monthlyRent: -100 }, "single");
    expect(r.grossComp).toBe(0);
    expect(r.housingCost).toBe(0);
  });
});

describe("compareOffers", () => {
  it("a no-income-tax state can beat a higher-paying high-tax state", () => {
    const ca: OfferInput = { ...blank, baseSalary: 180000, monthlyRent: 3400, colIndex: 178, stateTaxRate: 0.093 };
    const tx: OfferInput = { ...blank, baseSalary: 160000, monthlyRent: 1500, colIndex: 102, stateTaxRate: 0 };
    const r = compareOffers(ca, tx, "single");
    expect(r.winner).toBe("B");
    expect(r.difference).toBeCloseTo(r.a.leftover - r.b.leftover, 4);
    expect(r.absDifference).toBeCloseTo(Math.abs(r.difference), 4);
  });

  it("declares a tie for identical offers", () => {
    const r = compareOffers({ ...blank, baseSalary: 100000 }, { ...blank, baseSalary: 100000 }, "single");
    expect(r.winner).toBe("tie");
    expect(r.absDifference).toBe(0);
  });

  it("winner is A when A leaves more", () => {
    const r = compareOffers({ ...blank, baseSalary: 130000 }, { ...blank, baseSalary: 100000 }, "single");
    expect(r.winner).toBe("A");
    expect(r.difference).toBeGreaterThan(0);
  });
});
