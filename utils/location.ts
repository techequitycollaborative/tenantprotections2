import zipcodes from '@/data/zipcodes.json';
import EligibilityMatrix from '@/data/eligibility-matrix';
import { BuildingType } from '@/types/building';
import {
  RawLocation,
  Location,
  FullLocation,
  EligibilityRules,
} from '@/types/location';

const ELIGIBLE = 'eligible';
const EXEMPT = 'exempt';

function enrichLocation(location: RawLocation): FullLocation {
  const now = new Date();
  const eligibilityMatrix = EligibilityMatrix();
  const localRules = eligibilityMatrix.local[
    location.city as keyof typeof eligibilityMatrix.local
  ] as unknown as EligibilityRules;

  return {
    ...location,
    type: 'full',
    statewideRules: eligibilityMatrix.statewide,
    localRules: localRules ? localRules : undefined,
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
