// Cost-of-living data, U.S. national average index = 100.
// `index` drives the (assumed) non-housing living-cost estimate.
// `rent` is an approximate average monthly rent for the metro — used as the
// assumed housing cost when the user doesn't enter their own.
// All figures are approximations for v1; users can override rent directly.

export interface City {
  name: string;
  index: number;
  rent: number; // avg monthly rent, USD
}

export const NATIONAL_AVERAGE_INDEX = 100;
export const NATIONAL_AVERAGE_RENT = 1600;

export const CITIES: City[] = [
  { name: "Atlanta, GA", index: 107, rent: 1700 },
  { name: "Austin, TX", index: 103, rent: 1700 },
  { name: "Boston, MA", index: 150, rent: 3000 },
  { name: "Charlotte, NC", index: 100, rent: 1500 },
  { name: "Chicago, IL", index: 120, rent: 1900 },
  { name: "Columbus, OH", index: 92, rent: 1200 },
  { name: "Dallas, TX", index: 102, rent: 1500 },
  { name: "Denver, CO", index: 121, rent: 1800 },
  { name: "Detroit, MI", index: 96, rent: 1250 },
  { name: "Honolulu, HI", index: 180, rent: 2400 },
  { name: "Houston, TX", index: 96, rent: 1400 },
  { name: "Indianapolis, IN", index: 92, rent: 1200 },
  { name: "Kansas City, MO", index: 93, rent: 1200 },
  { name: "Las Vegas, NV", index: 107, rent: 1450 },
  { name: "Los Angeles, CA", index: 150, rent: 2500 },
  { name: "Miami, FL", index: 123, rent: 2600 },
  { name: "Minneapolis, MN", index: 111, rent: 1500 },
  { name: "Nashville, TN", index: 105, rent: 1700 },
  { name: "New Orleans, LA", index: 96, rent: 1500 },
  { name: "New York, NY", index: 187, rent: 3800 },
  { name: "Oakland, CA", index: 156, rent: 2600 },
  { name: "Orlando, FL", index: 102, rent: 1700 },
  { name: "Philadelphia, PA", index: 112, rent: 1700 },
  { name: "Phoenix, AZ", index: 108, rent: 1500 },
  { name: "Pittsburgh, PA", index: 95, rent: 1300 },
  { name: "Portland, OR", index: 130, rent: 1700 },
  { name: "Raleigh, NC", index: 101, rent: 1450 },
  { name: "Sacramento, CA", index: 127, rent: 1800 },
  { name: "Salt Lake City, UT", index: 109, rent: 1500 },
  { name: "San Diego, CA", index: 143, rent: 2600 },
  { name: "San Francisco, CA", index: 178, rent: 3400 },
  { name: "San Jose, CA", index: 175, rent: 3100 },
  { name: "Seattle, WA", index: 152, rent: 2200 },
  { name: "St. Louis, MO", index: 90, rent: 1150 },
  { name: "Tampa, FL", index: 105, rent: 1800 },
  { name: "Washington, DC", index: 152, rent: 2300 },
];
