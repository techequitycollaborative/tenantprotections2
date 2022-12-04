import unincorporatedAreasLA from '@/data/unincorporated-areas-la.json';
import zipcodes from '@/data/zipcodes.json';
import EligibilityMatrix from '@/data/eligibility-matrix';
import RentCapMatrix from '@/data/rentcap-matrix';
import {
  RawLocation,
  Location,
  FullLocation,
  EligibilityRules,
  RentCapHistory,
} from '@/types/location';

const ELIGIBLE = 'eligible';
const EXEMPT = 'exempt';

const UNINCORPORATED_LA_CITY_KEY = 'Unincorporated LA County';

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

  const isUnincorporatedLA = unincorporatedAreasLA.includes(city);
  const unincorporatedLAOverride = isUnincorporatedLA
    ? UNINCORPORATED_LA_CITY_KEY
    : city;

  const now = new Date();
  const eligibilityMatrix = EligibilityMatrix();
  const localRules = eligibilityMatrix.local[
    unincorporatedLAOverride as keyof typeof eligibilityMatrix.local
  ] as EligibilityRules;
  const rentCapMatrix = RentCapMatrix();
  const localRentCap = rentCapMatrix.local[
    unincorporatedLAOverride as keyof typeof rentCapMatrix.local
  ] as RentCapHistory;

  return {
    ...location,
    city: city,
    isUnincorporatedLA,
    type: 'full',
    statewideRules: eligibilityMatrix.statewide,
    localRules: localRules ? localRules : null,
    statewideRentCap: rentCapMatrix.statewide[location.area],
    localRentCap: localRentCap ? localRentCap : null,
  };
}

export function citiesFromZip(zip: string): string[] {
  let cities: string[] = [];

  if (zip in zipcodes) {
    if (typeof zipcodes[zip]['city'] === 'string') {
      cities.push(zipcodes[zip]['city'] as string);
    } else {
      cities = zipcodes[zip]['city'] as string[];
    }
  }

  return cities;
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
    base +
    '/zip/' +
    location.zip +
    '/city/' +
    location.city.replaceAll(' ', '_') +
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

export function unincorporatedLAOverride(location: FullLocation) {
  return location.isUnincorporatedLA
    ? UNINCORPORATED_LA_CITY_KEY
    : location.city;
}
