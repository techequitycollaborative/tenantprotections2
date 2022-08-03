import zipcodes from '@/data/zipcodes.json';
import EligibilityMatrix from '@/data/eligibility-matrix';
import { BuildingType } from '@/types/building';
import { RawLocation, Location, FullLocation } from '@/types/location';

const ELIGIBLE = 'eligible';
const EXEMPT = 'exempt';

function enrichLocation(location: RawLocation): FullLocation {
  const now = new Date();
  const eligibilityMatrix = EligibilityMatrix();
  const localRules = eligibilityMatrix.local[location.city];

  return {
    ...location,
    type: 'full',
    statewideRules: eligibilityMatrix.statewide,
    localRules: localRules ? localRules : null,
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
