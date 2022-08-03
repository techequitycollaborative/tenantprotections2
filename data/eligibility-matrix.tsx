import eligibility from '@/data/eligibility.json';
import { BuildingType } from '@/types/building';

const ELIGIBLE = 'eligible';
const EXEMPT = 'exempt';

function getPassingBuildingTypes(rules) {
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

  // ADUs automatically eligible unless there is an exemption for landlord living on main property
  if (rules.landlord_adu_exemption !== EXEMPT) {
    passingBuildingTypes.push(BuildingType.ADU);
  }

  // Duplexes eligible unless there is a landlord shared occupancy exemption
  if (
    !rules.landlord_shared_exemption &&
    !rules.landlord_occupancy_exemption_units
  ) {
    passingBuildingTypes.push(BuildingType.Duplex);

    // Also apartments as long as min_units is not higher than 2
    if (rules.min_units == 2) {
      passingBuildingTypes.push(BuildingType.Apartment);
    }
  }

  return passingBuildingTypes;
}

function getEligibilityQuestions(rules) {
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

    switch (rules.landlord_occupancy_exemption_duration) {
      case 'start-of-tenancy':
        question.promptKey = 'building-questions.landlord-onsite-tenancy-start';
        break;
      case 'one-year':
        question.promptKey = 'building-questions.landlord-onsite-one-year';
        question.promptVars = {
          units: rules.landlord_occupancy_exemption_units,
        };
        break;
      default:
        question.promptKey = 'building-questions.landlord-onsite';
        question.promptVars = {
          units: rules.landlord_occupancy_exemption_units,
        };
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
    eligibilityQuestions[BuildingType.Apartment] = apartmentQuestions;
  }

  // Duplexes
  if (rules.landlord_occupancy_exemption_units == 2) {
    let question = {
      passingAnswer: 'no',
      promptKey: 'building-questions.landlord-onside-tenancy-start',
      yesAnswerKey: 'yes',
      noAnswerKey: 'no',
    };

    eligibilityQuestions[BuildingType.Duplex] = [question];
  }

  // Condos/SFHs
  if (rules.reit_corp_llc === ELIGIBLE) {
    const question = {
      passingAnswer: 'yes',
      promptKey: 'building-questions.corp-ownership.prompt',
      yesAnswerKey: 'building-questions.corp-ownership.yes',
      noAnswerKey: 'building-questions.corp-ownership.no',
    };

    eligibilityQuestions[BuildingType.SFH] = [question];
    eligibilityQuestions[BuildingType.Condo] = [question];
  }

  // ADUs
  if (rules.landlord_adu_exemption === EXEMPT) {
    const question = {
      passingAnswer: 'no',
      promptKey: 'building-questions.landlord-adu-exemption',
      yesAnswerKey: 'yes',
      noAnswerKey: 'no',
    };

    eligibilityQuestions[BuildingType.ADU] = [question];
  }

  return eligibilityQuestions;
}

//
// Abstraction layer for converting raw eligiblity json file to structured data.
//
function EligibilityMatrix() {
  let matrix = {
    local: {},
  };

  Object.keys(eligibility).map((geography) => {
    let ruleset = {};
    ruleset.passingBuildingTypes = getPassingBuildingTypes(
      eligibility[geography],
    );
    ruleset.eligibilityQuestions = getEligibilityQuestions(
      eligibility[geography],
    );

    if (geography === 'Statewide') {
      const now = new Date();
      ruleset.builtBeforeMillis = Date.UTC(
        now.getUTCFullYear() - 15,
        now.getUTCMonth(),
        now.getUTCDate(),
      );

      matrix.statewide = ruleset;
    } else {
      ruleset.builtBeforeMillis = Date.parse(
        eligibility[geography].construction_date,
      );

      matrix.local[geography] = ruleset;
    }
  });

  return matrix;
}

export default EligibilityMatrix;
