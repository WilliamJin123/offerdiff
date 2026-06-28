// Cost-of-living data, U.S. national average index = 100.
// `index` drives the (assumed) non-housing living-cost estimate.
// `rent` is an approximate average monthly rent for the metro — used as the
// assumed housing cost when the user doesn't enter their own.
// `state` is the 2-letter code, used to estimate state income tax.
// All figures are approximations for v1; users can override rent directly.

export interface City {
  name: string;
  index: number;
  rent: number; // avg monthly rent, USD
  state: string; // 2-letter code for tax lookup
}

export const NATIONAL_AVERAGE_INDEX = 100;
export const NATIONAL_AVERAGE_RENT = 1600;

export const CITIES: City[] = [
  { name: "Atlanta, GA", index: 107, rent: 1700, state: "GA" },
  { name: "Austin, TX", index: 103, rent: 1700, state: "TX" },
  { name: "Boston, MA", index: 150, rent: 3000, state: "MA" },
  { name: "Charlotte, NC", index: 100, rent: 1500, state: "NC" },
  { name: "Chicago, IL", index: 120, rent: 1900, state: "IL" },
  { name: "Columbus, OH", index: 92, rent: 1200, state: "OH" },
  { name: "Dallas, TX", index: 102, rent: 1500, state: "TX" },
  { name: "Denver, CO", index: 121, rent: 1800, state: "CO" },
  { name: "Detroit, MI", index: 96, rent: 1250, state: "MI" },
  { name: "Honolulu, HI", index: 180, rent: 2400, state: "HI" },
  { name: "Houston, TX", index: 96, rent: 1400, state: "TX" },
  { name: "Indianapolis, IN", index: 92, rent: 1200, state: "IN" },
  { name: "Kansas City, MO", index: 93, rent: 1200, state: "MO" },
  { name: "Las Vegas, NV", index: 107, rent: 1450, state: "NV" },
  { name: "Los Angeles, CA", index: 150, rent: 2500, state: "CA" },
  { name: "Miami, FL", index: 123, rent: 2600, state: "FL" },
  { name: "Minneapolis, MN", index: 111, rent: 1500, state: "MN" },
  { name: "Nashville, TN", index: 105, rent: 1700, state: "TN" },
  { name: "New Orleans, LA", index: 96, rent: 1500, state: "LA" },
  { name: "New York, NY", index: 187, rent: 3800, state: "NY" },
  { name: "Oakland, CA", index: 156, rent: 2600, state: "CA" },
  { name: "Orlando, FL", index: 102, rent: 1700, state: "FL" },
  { name: "Philadelphia, PA", index: 112, rent: 1700, state: "PA" },
  { name: "Phoenix, AZ", index: 108, rent: 1500, state: "AZ" },
  { name: "Pittsburgh, PA", index: 95, rent: 1300, state: "PA" },
  { name: "Portland, OR", index: 130, rent: 1700, state: "OR" },
  { name: "Raleigh, NC", index: 101, rent: 1450, state: "NC" },
  { name: "Sacramento, CA", index: 127, rent: 1800, state: "CA" },
  { name: "Salt Lake City, UT", index: 109, rent: 1500, state: "UT" },
  { name: "San Diego, CA", index: 143, rent: 2600, state: "CA" },
  { name: "San Francisco, CA", index: 178, rent: 3400, state: "CA" },
  { name: "San Jose, CA", index: 175, rent: 3100, state: "CA" },
  { name: "Seattle, WA", index: 152, rent: 2200, state: "WA" },
  { name: "St. Louis, MO", index: 90, rent: 1150, state: "MO" },
  { name: "Tampa, FL", index: 105, rent: 1800, state: "FL" },
  { name: "Washington, DC", index: 152, rent: 2300, state: "DC" },
];
