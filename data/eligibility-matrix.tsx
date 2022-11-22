import eligibility from '@/data/eligibility.json';
import { BuildingType } from '@/types/building';
import { EligibilityRules } from '@/types/location';

const ELIGIBLE = 'eligible';
const EXEMPT = 'exempt';

interface Rules {
  [key: string]: any;
}

function getPassingBuildingTypes(rules: Rules) {
  let passingBuildingTypes = [];

  // Basic eligiblity check for dorms, hotels, and senior care
  if (rules.dorms === ELIGIBLE) {
    passingBuildingTypes.push(BuildingType.Dorm);
  }
  if (rules.hotels === ELIGIBLE) {
    passingBuildingTypes.push(BuildingType.Hotel);
  }
  if (rules.senior_care === ELIGIBLE) {
    passingBuildingTypes.push(BuildingType.Senior);
  }
  if (rules.duplex === ELIGIBLE && !rules.landlord_duplex_exemption) {
    passingBuildingTypes.push(BuildingType.Duplex);
  }

  // ADUs automatically eligible unless there is an exemption for landlord living on main property
  if (rules.landlord_adu_exemption !== EXEMPT) {
    passingBuildingTypes.push(BuildingType.ADU);
  }

  // If there is no unit minimum (effectively 2, otherwise it would be a different building type)
  // and no landlord occupancy exemptions, then apartments are eligible with no further questions.
  if (
    !rules.landlord_shared_exemption &&
    !rules.landlord_occupancy_exemption_units
  ) {
    if (rules.min_units == 2) {
      passingBuildingTypes.push(BuildingType.Apartment);
    }
  }

  return passingBuildingTypes;
}

function getEligibilityQuestions(rules: Rules) {
  let eligibilityQuestions = {};

  // Apartments
  let apartmentQuestions = [];
  if (rules.min_units > 2) {
    const question = {
      passingAnswer: 'yes',
      promptKey: 'building-questions.min-units',
      promptVars: { units: rules.min_units },
      yesAnswerKey: 'yes',
      noAnswerKey: 'no',
    };

    apartmentQuestions.push(question);
  }
  if (rules.landlord_occupancy_exemption_units) {
    let question = {
      passingAnswer: 'no',
      yesAnswerKey: 'yes',
      noAnswerKey: 'no',
    };

    if (rules.landlord_occupancy_exemption_duration === 'one-year') {
      Object.assign(question, {
        promptKey: 'building-questions.landlord-onsite-one-year',
      });
      Object.assign(question, {
        promptVars: { units: rules.landlord_occupancy_exemption_units },
      });
    } else {
      Object.assign(question, {
        promptKey: 'building-questions.landlord-onsite',
      });
      Object.assign(question, {
        promptVars: { units: rules.landlord_occupancy_exemption_units },
      });
    }

    apartmentQuestions.push(question);
  }
  if (rules.landlord_shared_exemption) {
    const question = {
      passingAnswer: 'no',
      promptKey: 'building-questions.landlord-shared-exemption',
      yesAnswerKey: 'yes',
      noAnswerKey: 'no',
    };

    apartmentQuestions.push(question);
  }
  if (apartmentQuestions.length > 0) {
    Object.assign(eligibilityQuestions, {
      [BuildingType.Apartment]: apartmentQuestions,
    });
  }

  // Duplexes
  if (rules.landlord_duplex_exemption) {
    let question = {
      passingAnswer: 'no',
      promptKey: 'building-questions.duplex-landlord-onsite-tenancy-start',
      yesAnswerKey: 'yes',
      noAnswerKey: 'no',
    };

    Object.assign(eligibilityQuestions, { [BuildingType.Duplex]: [question] });
  }

  // Condos/SFHs
  if (rules.reit_corp_llc === ELIGIBLE) {
    const question = {
      passingAnswer: 'yes',
      promptKey: 'building-questions.corp-ownership.prompt',
      yesAnswerKey: 'building-questions.corp-ownership.yes',
      noAnswerKey: 'building-questions.corp-ownership.no',
    };

    Object.assign(eligibilityQuestions, { [BuildingType.SFH]: [question] });
    Object.assign(eligibilityQuestions, { [BuildingType.Condo]: [question] });
  }

  // ADUs
  if (rules.landlord_adu_exemption === EXEMPT) {
    const question = {
      passingAnswer: 'no',
      promptKey: 'building-questions.landlord-adu-exemption',
      yesAnswerKey: 'yes',
      noAnswerKey: 'no',
    };

    Object.assign(eligibilityQuestions, { [BuildingType.ADU]: [question] });
  }

  return eligibilityQuestions;
}

//
// Abstraction layer for converting raw eligiblity json file to structured data.
//
function EligibilityMatrix() {
  const undefinedRuleset: EligibilityRules = {
    builtBeforeMillis: Date.UTC(0, 0, 0, 0, 0, 0),
    passingBuildingTypes: [],
    eligibilityQuestions: {},
  };

  let matrix = {
    statewide: undefinedRuleset,
    local: {},
  };

  Object.keys(eligibility).map((geography) => {
    let ruleset = {};
    Object.assign(ruleset, {
      passingBuildingTypes: getPassingBuildingTypes(
        (eligibility as any)[geography],
      ),
    });
    Object.assign(ruleset, {
      eligibilityQuestions: getEligibilityQuestions(
        (eligibility as any)[geography],
      ),
    });

    if (geography === 'Statewide') {
      const now = new Date();
      Object.assign(ruleset, {
        builtBeforeMillis: Date.UTC(
          now.getUTCFullYear() - 15,
          now.getUTCMonth(),
          now.getUTCDate(),
        ),
      });

      Object.assign(matrix, { statewide: ruleset });
    } else {
      Object.assign(ruleset, {
        builtBeforeMillis: Date.parse(
          (eligibility as any)[geography].construction_date,
        ),
      });

      Object.assign(matrix.local, { [geography]: ruleset });
    }
  });

  return matrix;
}

export default EligibilityMatrix;
