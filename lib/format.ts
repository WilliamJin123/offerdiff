/** Format a dollar amount as USD with no cents (rounded). */
export function formatUSD(n: number, opts: { signed?: boolean } = {}): string {
  const rounded = Math.round(n);
  const abs = Math.abs(rounded);
  const formatted = abs.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  if (opts.signed) {
    if (rounded > 0) return `+${formatted}`;
    if (rounded < 0) return `-${formatted}`;
  }
  return rounded < 0 ? `-${formatted}` : formatted;
}

/** Parse a free-text money/number field; blank or junk becomes NaN (calc treats it as 0). */
export function parseField(value: string): number {
  if (value.trim() === "") return NaN;
  return Number(value.replace(/[$,\s]/g, ""));
}
