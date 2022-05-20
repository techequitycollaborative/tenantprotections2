import zipcodes from '@/data/zipcodes.json';
import { BuildingType } from '@/types/building';
import { RawLocation, Location, FullLocation } from '@/types/location';

function enrichLocation(location: RawLocation): FullLocation {
  const now = new Date();
  const rentCap = {
    buildingEligibilityQuestions: {},
    builtBeforeMillis: Date.UTC(
      now.getUTCFullYear() - 15,
      now.getUTCMonth(),
      now.getUTCDate(),
    ),
  };
  const enriched: FullLocation = {
    ...location,
    rentCap,
    type: 'full',
  };

  // NOTE: all questions included so far have yet to be verified by a lawyer.
  switch (location.city) {
    case 'Berkeley': {
      return {
        ...enriched,
        rentControl: {
          buildingEligibilityQuestions: {
            [BuildingType.SFH]: [
              {
                passingAnswer: 'yes',
                promptKey: 'localQuestions.berkeley-boarding-house',
                noAnswerKey: 'no',
                yesAnswerKey: 'yes',
              },
            ],
          },
          builtBeforeMillis: Date.UTC(1980, 6, 1, 0, 0, 0, 1),
        },
      };
    }
    case 'Oakland': {
      return {
        ...enriched,
        rentControl: {
          buildingEligibilityQuestions: {},
          builtBeforeMillis: Date.UTC(1983, 0, 1, 0, 0, 0, 1),
        },
      };
    }
    case 'San Francisco': {
      return {
        ...enriched,
        rentControl: {
          buildingEligibilityQuestions: {},
          builtBeforeMillis: Date.UTC(1979, 5, 13, 0, 0, 0, 1),
        },
      };
    }
    default:
      return enriched;
  }
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
