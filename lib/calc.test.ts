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

const blank: OfferInput = {
  baseSalary: 0,
  bonus: 0,
  equity: 0,
  benefits: 0,
  commuteMinutes: 0,
  remoteDays: 0,
  monthlyRent: 0,
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
});

describe("computeOffer — commute cost", () => {
  it("values commute time at 50% of hourly wage", () => {
    // base 104,000 -> hourly = 50. 30 min one-way, 5 in-office days.
    // daily round trip = 1h; annual = 1*5*48 = 240h; cost = 240*50*0.5 = 6000.
    const r = computeOffer({ ...blank, baseSalary: 104000, commuteMinutes: 30 });
    expect(r.hourlyWage).toBe(50);
    expect(r.inOfficeDays).toBe(5);
    expect(r.annualCommuteHours).toBe(240);
    expect(r.commuteCost).toBe(6000);
  });

  it("remote days reduce in-office days and thus commute cost", () => {
    const full = computeOffer({ ...blank, baseSalary: 104000, commuteMinutes: 30, remoteDays: 0 });
    const hybrid = computeOffer({ ...blank, baseSalary: 104000, commuteMinutes: 30, remoteDays: 2 });
    expect(hybrid.inOfficeDays).toBe(3);
    expect(hybrid.commuteCost).toBeCloseTo(full.commuteCost * (3 / 5), 6);
  });

  it("5 remote days means zero commute cost", () => {
    const r = computeOffer({ ...blank, baseSalary: 200000, commuteMinutes: 90, remoteDays: 5 });
    expect(r.inOfficeDays).toBe(0);
    expect(r.commuteCost).toBe(0);
  });

  it("uses the documented constants", () => {
    expect(WORKING_WEEKS_PER_YEAR).toBe(48);
    expect(HOURS_PER_YEAR_FULL_TIME).toBe(2080);
    expect(COMMUTE_TIME_VALUE_FACTOR).toBe(0.5);
    expect(NONHOUSING_BASELINE).toBe(22000);
  });
});

describe("computeOffer — housing", () => {
  it("annualizes monthly rent", () => {
    const r = computeOffer({ ...blank, monthlyRent: 2500 });
    expect(r.housingCost).toBe(30000);
  });

  it("zero rent means zero housing cost", () => {
    expect(computeOffer({ ...blank, monthlyRent: 0 }).housingCost).toBe(0);
  });
});

describe("computeOffer — living cost", () => {
  it("scales the non-housing baseline by the COL index", () => {
    expect(computeOffer({ ...blank, colIndex: 100 }).livingCost).toBe(22000);
    expect(computeOffer({ ...blank, colIndex: 150 }).livingCost).toBe(33000);
    expect(computeOffer({ ...blank, colIndex: 50 }).livingCost).toBe(11000);
  });

  it("guards a zero/negative index (falls back to national average)", () => {
    expect(computeOffer({ ...blank, colIndex: 0 }).livingCost).toBe(22000);
    expect(computeOffer({ ...blank, colIndex: -5 }).livingCost).toBe(22000);
  });
});

describe("computeOffer — leftover", () => {
  it("subtracts commute, housing, and living from gross", () => {
    // gross 154,000 ; base 100k -> hourly 48.0769..., commute 30min 5 days
    // annual hrs = 240 ; commute = 240*(100000/2080)*0.5 = 5769.23...
    // housing = 2000*12 = 24000 ; living = 22000*1.2 = 26400
    const r = computeOffer({
      ...blank,
      baseSalary: 100000,
      bonus: 20000,
      equity: 30000,
      benefits: 4000,
      commuteMinutes: 30,
      monthlyRent: 2000,
      colIndex: 120,
    });
    expect(r.grossComp).toBe(154000);
    expect(r.commuteCost).toBeCloseTo(240 * (100000 / 2080) * 0.5, 4);
    expect(r.housingCost).toBe(24000);
    expect(r.livingCost).toBe(26400);
    expect(r.leftover).toBeCloseTo(154000 - r.commuteCost - 24000 - 26400, 4);
  });
});

describe("computeOffer — input sanitization", () => {
  it("clamps remoteDays to 0..5", () => {
    expect(computeOffer({ ...blank, remoteDays: 9 }).inOfficeDays).toBe(0);
    expect(computeOffer({ ...blank, remoteDays: -3 }).inOfficeDays).toBe(5);
  });

  it("treats NaN / non-finite / negative money as 0", () => {
    const r = computeOffer({ ...blank, baseSalary: NaN, bonus: Infinity, monthlyRent: -100 });
    expect(r.grossComp).toBe(0);
    expect(r.housingCost).toBe(0);
  });
});

describe("compareOffers", () => {
  it("reports the offer that leaves more as the winner with a signed difference", () => {
    const a: OfferInput = { ...blank, baseSalary: 180000, monthlyRent: 3400, colIndex: 178 }; // SF
    const b: OfferInput = { ...blank, baseSalary: 150000, monthlyRent: 1700, colIndex: 103 }; // Austin
    const r = compareOffers(a, b);
    expect(r.winner).toBe("B");
    expect(r.difference).toBeCloseTo(r.a.leftover - r.b.leftover, 4);
    expect(r.absDifference).toBeCloseTo(Math.abs(r.difference), 4);
  });

  it("declares a tie when leftovers are equal", () => {
    const r = compareOffers({ ...blank, baseSalary: 100000 }, { ...blank, baseSalary: 100000 });
    expect(r.winner).toBe("tie");
    expect(r.absDifference).toBe(0);
  });

  it("winner is A when A leaves more", () => {
    const r = compareOffers({ ...blank, baseSalary: 120000 }, { ...blank, baseSalary: 100000 });
    expect(r.winner).toBe("A");
    expect(r.difference).toBe(20000);
  });
});
