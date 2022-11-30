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
import { assertIsString } from './assert';

const ELIGIBLE = 'eligible';
const EXEMPT = 'exempt';

/**
 * Convert RawLocation to FullLocation if only one city within the RawLocation
 * or the provided city exists with the RawLocation city array.
 * Else, return RawLocation and request user to confirm correct city.
 */
function tryEnrichLocation(
  location: RawLocation,
  city?: string,
): FullLocation | RawLocation {
  if (!Array.isArray(location.city)) {
    city = location.city;
  }
  if (
    !city ||
    (Array.isArray(location.city) && !location.city.includes(city))
  ) {
    return location;
  }

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
    city: city,
    type: 'full',
    statewideRules: eligibilityMatrix.statewide,
    localRules: localRules ? localRules : null,
    statewideRentCap: rentCapMatrix.statewide[location.area],
    localRentCap: localRentCap ? localRentCap : null,
  };
}

export function locationFromZip(zip: string, city?: string): Location {
  if (!(zip in zipcodes)) {
    return { zip, type: 'unknown' };
  }

  const data: RawLocation = {
    ...zipcodes[zip],
    type: 'raw',
  };
  return tryEnrichLocation(data, city);
}

export function getPathFromLocation(
  base: string,
  location: FullLocation,
  page?: string,
  params?: { [index: string]: string },
): string {
  let paramString = '';
  let pageString = '';

  if (page) {
    pageString = '/' + page;
  }

  if (params) {
    paramString += '?';
    for (let key in params) {
      let value = params[key];
      paramString += key + '=' + value;
    }
  }
  return (
    '/' +
    base +
    '/zip/' +
    location.zip +
    '/city/' +
    location.city +
    pageString +
    paramString
  );
}

export function lookupRentCap(
  rentCapHistory: RentCapHistory,
  date: Date,
): number | undefined {
  let rate = undefined;

  rentCapHistory.map((x, i) => {
    const start = new Date(x.start);
    const end = new Date(x.end);
    if (date >= start && date <= end) {
      rate = x.rate;
    }
  });

  return rate;
}
