// Cost-of-living indices, U.S. national average = 100.
// Approximate composite indices (housing-weighted) for v1. Good enough to make
// the purchasing-power adjustment meaningful; users can override with a custom index.

export interface City {
  name: string;
  index: number;
}

export const NATIONAL_AVERAGE_INDEX = 100;

export const CITIES: City[] = [
  { name: "Atlanta, GA", index: 107 },
  { name: "Austin, TX", index: 103 },
  { name: "Boston, MA", index: 150 },
  { name: "Charlotte, NC", index: 100 },
  { name: "Chicago, IL", index: 120 },
  { name: "Columbus, OH", index: 92 },
  { name: "Dallas, TX", index: 102 },
  { name: "Denver, CO", index: 121 },
  { name: "Detroit, MI", index: 96 },
  { name: "Honolulu, HI", index: 180 },
  { name: "Houston, TX", index: 96 },
  { name: "Indianapolis, IN", index: 92 },
  { name: "Kansas City, MO", index: 93 },
  { name: "Las Vegas, NV", index: 107 },
  { name: "Los Angeles, CA", index: 150 },
  { name: "Miami, FL", index: 123 },
  { name: "Minneapolis, MN", index: 111 },
  { name: "Nashville, TN", index: 105 },
  { name: "New Orleans, LA", index: 96 },
  { name: "New York, NY", index: 187 },
  { name: "Oakland, CA", index: 156 },
  { name: "Orlando, FL", index: 102 },
  { name: "Philadelphia, PA", index: 112 },
  { name: "Phoenix, AZ", index: 108 },
  { name: "Pittsburgh, PA", index: 95 },
  { name: "Portland, OR", index: 130 },
  { name: "Raleigh, NC", index: 101 },
  { name: "Sacramento, CA", index: 127 },
  { name: "Salt Lake City, UT", index: 109 },
  { name: "San Diego, CA", index: 143 },
  { name: "San Francisco, CA", index: 178 },
  { name: "San Jose, CA", index: 175 },
  { name: "Seattle, WA", index: 152 },
  { name: "St. Louis, MO", index: 90 },
  { name: "Tampa, FL", index: 105 },
  { name: "Washington, DC", index: 152 },
];
