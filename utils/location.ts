import zipcodes from '@/data/zipcodes.json';
import EligibilityMatrix from '@/data/eligibility-matrix';
import RentCapMatrix from '@/data/rentcap-matrix';
import { BuildingType } from '@/types/building';
import {
  RawLocation,
  Location,
  FullLocation,
  EligibilityRules,
  RentCapHistory,
} from '@/types/location';

const ELIGIBLE = 'eligible';
const EXEMPT = 'exempt';

function enrichLocation(location: RawLocation): FullLocation {
  const now = new Date();
  const eligibilityMatrix = EligibilityMatrix();
  const localRules = eligibilityMatrix.local[
    location.city as keyof typeof eligibilityMatrix.local
  ] as unknown as EligibilityRules;
  const rentCapMatrix = RentCapMatrix();
  const localRentCap = rentCapMatrix.local[
    location.city as keyof typeof rentCapMatrix.local
  ] as unknown as RentCapHistory;

  return {
    ...location,
    type: 'full',
    statewideRules: eligibilityMatrix.statewide,
    localRules: localRules ? localRules : null,
    statewideRentCap: rentCapMatrix.statewide[location.area],
    localRentCap: localRentCap ? localRentCap : null,
  };
}

export function locationFromZip(zip: string): Location {
  if (!(zip in zipcodes)) {
    return { zip, type: 'unknown' };
  }

  const data: RawLocation = {
    ...zipcodes[zip],
    type: 'raw',
  };
  return enrichLocation(data);
}

export function lookupRentCap(
  rentCapHistory: RentCapHistory,
  date: Date,
): number {
  let rate = 0;

  rentCapHistory.map((x, i) => {
    const start = new Date(x.start);
    const end = new Date(x.end);
    if (date >= start && date <= end) {
      rate = x.rate;
    }
  });

  return rate;
}
