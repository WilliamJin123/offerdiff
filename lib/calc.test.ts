import { describe, it, expect } from "vitest";
import {
  computeOffer,
  compareOffers,
  WORKING_WEEKS_PER_YEAR,
  HOURS_PER_YEAR_FULL_TIME,
  COMMUTE_TIME_VALUE_FACTOR,
  type OfferInput,
} from "./calc";

const blank: OfferInput = {
  baseSalary: 0,
  bonus: 0,
  equity: 0,
  benefits: 0,
  commuteMinutes: 0,
  remoteDays: 0,
  colIndex: 100,
};

describe("computeOffer — gross comp", () => {
  it("sums base, bonus, equity, and benefits", () => {
    const r = computeOffer({
      ...blank,
      baseSalary: 100000,
      bonus: 15000,
      equity: 20000,
      benefits: 5000,
    });
    expect(r.grossComp).toBe(140000);
  });

  it("with no commute and national COL, adjusted value equals gross", () => {
    const r = computeOffer({ ...blank, baseSalary: 100000 });
    expect(r.commuteCost).toBe(0);
    expect(r.adjustedValue).toBe(100000);
  });
});

describe("computeOffer — commute cost", () => {
  it("values commute time at 50% of hourly wage", () => {
    // base 104,000 -> hourly wage = 104000/2080 = 50/hr
    // 30 min one-way, 5 in-office days, no remote
    // daily round trip = 1 hour; annual hours = 1 * 5 * 48 = 240
    // commute cost = 240 * 50 * 0.5 = 6000
    const r = computeOffer({
      ...blank,
      baseSalary: 104000,
      commuteMinutes: 30,
      remoteDays: 0,
    });
    expect(r.hourlyWage).toBe(50);
    expect(r.inOfficeDays).toBe(5);
    expect(r.annualCommuteHours).toBe(240);
    expect(r.commuteCost).toBe(6000);
    expect(r.netNominal).toBe(104000 - 6000);
    expect(r.adjustedValue).toBe(98000);
  });

  it("remote days reduce in-office days and thus commute cost", () => {
    // 2 remote days -> 3 in-office days. half the commute of 0 remote? no: 3/5
    const full = computeOffer({ ...blank, baseSalary: 104000, commuteMinutes: 30, remoteDays: 0 });
    const hybrid = computeOffer({ ...blank, baseSalary: 104000, commuteMinutes: 30, remoteDays: 2 });
    expect(hybrid.inOfficeDays).toBe(3);
    expect(hybrid.commuteCost).toBeCloseTo(full.commuteCost * (3 / 5), 6);
  });

  it("5 remote days means zero commute cost regardless of commute time", () => {
    const r = computeOffer({ ...blank, baseSalary: 200000, commuteMinutes: 90, remoteDays: 5 });
    expect(r.inOfficeDays).toBe(0);
    expect(r.commuteCost).toBe(0);
  });

  it("uses the documented constants", () => {
    expect(WORKING_WEEKS_PER_YEAR).toBe(48);
    expect(HOURS_PER_YEAR_FULL_TIME).toBe(2080);
    expect(COMMUTE_TIME_VALUE_FACTOR).toBe(0.5);
  });
});

describe("computeOffer — cost of living", () => {
  it("a high COL index reduces purchasing power", () => {
    // 100k at index 200 -> factor 0.5 -> 50k adjusted
    const r = computeOffer({ ...blank, baseSalary: 100000, colIndex: 200 });
    expect(r.colFactor).toBe(0.5);
    expect(r.adjustedValue).toBe(50000);
  });

  it("a low COL index increases purchasing power", () => {
    // 100k at index 80 -> factor 1.25 -> 125k adjusted
    const r = computeOffer({ ...blank, baseSalary: 100000, colIndex: 80 });
    expect(r.colFactor).toBe(1.25);
    expect(r.adjustedValue).toBe(125000);
  });
});

describe("computeOffer — input sanitization", () => {
  it("clamps remoteDays to 0..5", () => {
    expect(computeOffer({ ...blank, remoteDays: 9 }).inOfficeDays).toBe(0);
    expect(computeOffer({ ...blank, remoteDays: -3 }).inOfficeDays).toBe(5);
  });

  it("treats NaN / non-finite money as 0", () => {
    const r = computeOffer({ ...blank, baseSalary: NaN, bonus: Infinity });
    expect(r.grossComp).toBe(0);
  });

  it("guards against zero or negative COL index (falls back to national average)", () => {
    expect(computeOffer({ ...blank, baseSalary: 100000, colIndex: 0 }).adjustedValue).toBe(100000);
    expect(computeOffer({ ...blank, baseSalary: 100000, colIndex: -50 }).adjustedValue).toBe(100000);
  });

  it("treats negative money inputs as 0", () => {
    expect(computeOffer({ ...blank, baseSalary: -100000 }).grossComp).toBe(0);
  });
});

describe("compareOffers", () => {
  it("reports the higher adjusted offer as the winner with a signed difference", () => {
    const a: OfferInput = { ...blank, baseSalary: 150000, colIndex: 180 }; // SF-ish
    const b: OfferInput = { ...blank, baseSalary: 130000, colIndex: 103 }; // Austin-ish
    const r = compareOffers(a, b);
    expect(r.a.adjustedValue).toBeCloseTo(150000 * (100 / 180), 4);
    expect(r.b.adjustedValue).toBeCloseTo(130000 * (100 / 103), 4);
    expect(r.winner).toBe("B");
    expect(r.difference).toBeCloseTo(r.a.adjustedValue - r.b.adjustedValue, 4);
    expect(r.absDifference).toBeCloseTo(Math.abs(r.difference), 4);
  });

  it("declares a tie when adjusted values are equal", () => {
    const r = compareOffers({ ...blank, baseSalary: 100000 }, { ...blank, baseSalary: 100000 });
    expect(r.winner).toBe("tie");
    expect(r.absDifference).toBe(0);
  });

  it("winner is A when A is higher", () => {
    const r = compareOffers({ ...blank, baseSalary: 120000 }, { ...blank, baseSalary: 100000 });
    expect(r.winner).toBe("A");
    expect(r.difference).toBe(20000);
  });
});
