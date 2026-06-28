import { describe, it, expect } from "vitest";
import {
  federalIncomeTax,
  ficaTax,
  estimateTax,
  stateRateForCode,
  STATE_TAX_RATES,
  NATIONAL_STATE_RATE,
} from "./tax";

describe("federalIncomeTax", () => {
  it("is zero at or below the standard deduction", () => {
    expect(federalIncomeTax(0, "single")).toBe(0);
    expect(federalIncomeTax(15000, "single")).toBe(0);
  });

  it("computes progressive tax for a single filer at $100k", () => {
    // taxable = 100,000 - 15,000 = 85,000
    // 10%*11,925 + 12%*(48,475-11,925) + 22%*(85,000-48,475)
    const expected = 11925 * 0.1 + (48475 - 11925) * 0.12 + (85000 - 48475) * 0.22;
    expect(federalIncomeTax(100000, "single")).toBeCloseTo(expected, 2);
  });

  it("married brackets are wider, so MFJ owes less than single at the same income", () => {
    expect(federalIncomeTax(150000, "married")).toBeLessThan(federalIncomeTax(150000, "single"));
  });
});

describe("ficaTax", () => {
  it("is 7.65% below the SS wage base", () => {
    expect(ficaTax(100000, "single")).toBeCloseTo(6200 + 1450, 2);
  });

  it("caps Social Security at the wage base and adds the Medicare surtax", () => {
    // SS capped at 176,100*0.062; medicare 1.45% on all; +0.9% over 200k (single)
    const expected = 176100 * 0.062 + 300000 * 0.0145 + (300000 - 200000) * 0.009;
    expect(ficaTax(300000, "single")).toBeCloseTo(expected, 2);
  });

  it("uses the married surtax threshold of 250k", () => {
    const single = ficaTax(240000, "single");
    const married = ficaTax(240000, "married");
    expect(single).toBeGreaterThan(married); // single crosses 200k surtax, married doesn't
  });
});

describe("stateRateForCode", () => {
  it("returns 0 for no-income-tax states", () => {
    expect(stateRateForCode("TX")).toBe(0);
    expect(stateRateForCode("WA")).toBe(0);
    expect(stateRateForCode("FL")).toBe(0);
  });

  it("returns the mapped rate for income-tax states", () => {
    expect(stateRateForCode("CA")).toBe(STATE_TAX_RATES.CA);
    expect(stateRateForCode("ny")).toBe(STATE_TAX_RATES.NY); // case-insensitive
  });

  it("falls back to the national average for unknown/missing codes", () => {
    expect(stateRateForCode(undefined)).toBe(NATIONAL_STATE_RATE);
    expect(stateRateForCode("ZZ")).toBe(NATIONAL_STATE_RATE);
  });
});

describe("estimateTax", () => {
  it("sums federal, state, and FICA", () => {
    const t = estimateTax(150000, "single", 0.093);
    expect(t.federal).toBeCloseTo(federalIncomeTax(150000, "single"), 2);
    expect(t.fica).toBeCloseTo(ficaTax(150000, "single"), 2);
    expect(t.state).toBeCloseTo(150000 * 0.093, 2);
    expect(t.total).toBeCloseTo(t.federal + t.state + t.fica, 2);
  });

  it("a no-tax state owes less total than a high-tax state at equal income", () => {
    const tx = estimateTax(200000, "single", stateRateForCode("TX"));
    const ca = estimateTax(200000, "single", stateRateForCode("CA"));
    expect(tx.state).toBe(0);
    expect(ca.total).toBeGreaterThan(tx.total);
  });
});
