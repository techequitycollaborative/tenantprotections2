import eligibility from '@/data/eligibility.json';
import { BuildingType } from '@/types/building';
import { EligibilityRules } from '@/types/location';

const ELIGIBLE = 'eligible';
const EXEMPT = 'exempt';

interface Rules {
  [key: string]: any;
}

function getSubsidizedExemptions(rules: Rules) {
  return {
    sec8: rules.sec8,
    lihtc: rules.lihtc,
  };
}

function getPassingBuildingTypes(rules: Rules) {
  let passingBuildingTypes = [];

  let hasApartmentQuestions = false;
  let hasDuplexQuestions = false;

  // Resolve additional question checks
  if (rules.landlord_shared_exemption) {
    hasApartmentQuestions = true;
    hasDuplexQuestions = true;
  }
  if (rules.relative_occupancy_q1) {
    hasApartmentQuestions = true;
    hasDuplexQuestions = true;
  }
  if (rules.relative_occupancy_q2) {
    hasApartmentQuestions = true;
    hasDuplexQuestions = true;
  }
  if (rules.relative_occupancy_wh) {
    hasApartmentQuestions = true;
    hasDuplexQuestions = true;
  }
  if (rules.landlord_occupancy) {
    hasApartmentQuestions = true;
    hasDuplexQuestions = true;
  }
  if (rules.landlord_occupancy_tenancy) {
    hasApartmentQuestions = true;
    hasDuplexQuestions = true;
  }
  if (rules.landlord_occupancy_1year) {
    hasApartmentQuestions = true;
    hasDuplexQuestions = true;
  }
  if (rules.berkeley_duplex) {
    hasDuplexQuestions = true;
  }
  if (rules.duplex_attached) {
    hasDuplexQuestions = true;
  }
  if (rules.duplex_building) {
    hasDuplexQuestions = true;
  }

  // Set up autopass for types that are eligible and/or don't have additional questions
  if (rules.dorms === ELIGIBLE) {
    passingBuildingTypes.push(BuildingType.Dorm);
  }
  if (rules.hotels === ELIGIBLE) {
    passingBuildingTypes.push(BuildingType.Hotel);
  }
  if (rules.senior_care === ELIGIBLE) {
    passingBuildingTypes.push(BuildingType.Senior);
  }
  if (rules.duplex === ELIGIBLE && !hasDuplexQuestions) {
    passingBuildingTypes.push(BuildingType.Duplex);
  }
  if (rules.min_units == 2 && !hasApartmentQuestions) {
    passingBuildingTypes.push(BuildingType.Apartment);
  }

  return passingBuildingTypes;
}

function getEligibilityQuestions(rules: Rules) {
  const CORP_REIT = {
    passingAnswer: 'yes',
    promptKey: 'building-questions.corp-ownership.prompt',
    yesAnswerKey: 'building-questions.corp-ownership.yes',
    noAnswerKey: 'building-questions.corp-ownership.no',
  };
  const MIN_UNITS = {
    passingAnswer: 'yes',
    promptKey: 'building-questions.min-units',
    promptVars: { units: rules.min_units },
    yesAnswerKey: 'yes',
    noAnswerKey: 'no',
  };
  const HOTELS_A = {
    passingAnswer: 'yes',
    promptKey: 'building-questions.hotels_a',
    promptVars: { days: rules.hotels },
    yesAnswerKey: 'yes',
    noAnswerKey: 'no',
  };
  const HOTELS_B = {
    passingAnswer: 'no',
    promptKey: 'building-questions.hotels_b.prompt',
    yesAnswerKey: 'building-questions.hotels_b.yes',
    noAnswerKey: 'building-questions.hotels_b.no',
  };
  const HOTELS_Q2 = {
    passingAnswer: 'yes',
    promptKey: 'building-questions.hotels_q2',
    promptVars: { days: rules.hotels_q2 },
    yesAnswerKey: 'yes',
    noAnswerKey: 'no',
  };
  const LANDLORD_SHARED_EXEMPTION = {
    passingAnswer: 'no',
    promptKey: 'building-questions.landlord_shared_exemption',
    yesAnswerKey: 'yes',
    noAnswerKey: 'no',
  };
  const RELATIVE_OCCUPANCY_Q1 = {
    passingAnswer: 'no',
    promptKey: 'building-questions.relative_occupancy_q1',
    yesAnswerKey: 'yes',
    noAnswerKey: 'no',
  };
  const RELATIVE_OCCUPANCY_Q2 = {
    passingAnswer: 'no',
    promptKey: 'building-questions.relative_occupancy_q2',
    yesAnswerKey: 'yes',
    noAnswerKey: 'no',
  };
  const RELATIVE_OCCUPANCY_WH = {
    passingAnswer: 'no',
    promptKey: 'building-questions.relative_occupancy_wh',
    yesAnswerKey: 'yes',
    noAnswerKey: 'no',
  };
  const LANDLORD_OCCUPANCY = {
    passingAnswer: 'no',
    promptKey: 'building-questions.landlord_occupancy',
    promptVars: { units: rules.landlord_occupancy },
    yesAnswerKey: 'yes',
    noAnswerKey: 'no',
  };
  const LANDLORD_OCCUPANCY_TENANCY = {
    passingAnswer: 'no',
    promptKey: 'building-questions.landlord_occupancy_tenancy',
    promptVars: { units: rules.landlord_occupancy_tenancy },
    yesAnswerKey: 'yes',
    noAnswerKey: 'no',
  };
  const LANDLORD_OCCUPANCY_1YEAR = {
    passingAnswer: 'no',
    promptKey: 'building-questions.landlord_occupancy_1year',
    promptVars: { units: rules.landlord_occupancy_1year },
    yesAnswerKey: 'yes',
    noAnswerKey: 'no',
  };
  const BERKELEY_DUPLEX = {
    passingAnswer: 'no',
    promptKey: 'building-questions.berkeley_duplex',
    yesAnswerKey: 'yes',
    noAnswerKey: 'no',
  };
  const DUPLEX_ATTACHED = {
    passingAnswer: 'no',
    promptKey: 'building-questions.duplex_attached',
    yesAnswerKey: 'yes',
    noAnswerKey: 'no',
  };
  const DUPLEX_BUILDING = {
    passingAnswer: 'no',
    promptKey: 'building-questions.duplex_building',
    yesAnswerKey: 'yes',
    noAnswerKey: 'no',
  };

  let eligibilityQuestions = {};

  let apartmentQuestions = [];
  let condoSFHQuestions = [];
  let duplexQuestions = [];
  let hotelQuestions = [];

  // Condos and SFHs
  if (rules.reit_corp_llc) {
    condoSFHQuestions.push(CORP_REIT);
  }

  // Apartments
  if (rules.min_units > 2) {
    apartmentQuestions.push(MIN_UNITS);
  }

  // Hotels
  if (rules.hotels > 0) {
    hotelQuestions.push(HOTELS_A);
  }
  hotelQuestions.push(HOTELS_B);
  if (rules.hotels_q2) {
    hotelQuestions.push(HOTELS_Q2);
  }

  // Condo, SFH, Apartment, Duplex, ADU questions
  if (rules.landlord_shared_exemption) {
    apartmentQuestions.push(LANDLORD_SHARED_EXEMPTION);
    duplexQuestions.push(LANDLORD_SHARED_EXEMPTION);
  }
  if (rules.relative_occupancy_q1) {
    apartmentQuestions.push(RELATIVE_OCCUPANCY_Q1);
    duplexQuestions.push(RELATIVE_OCCUPANCY_Q1);
  }

  if (rules.relative_occupancy_q2) {
    apartmentQuestions.push(RELATIVE_OCCUPANCY_Q2);
    duplexQuestions.push(RELATIVE_OCCUPANCY_Q2);
  }

  if (rules.relative_occupancy_wh) {
    apartmentQuestions.push(RELATIVE_OCCUPANCY_WH);
    duplexQuestions.push(RELATIVE_OCCUPANCY_WH);
  }

  // Apartment, Duplex, ADU questions
  if (rules.landlord_occupancy) {
    duplexQuestions.push(LANDLORD_OCCUPANCY);
    if (rules.landlord_occupancy > 2) {
      apartmentQuestions.push(LANDLORD_OCCUPANCY);
    }
  }
  if (rules.landlord_occupancy_tenancy) {
    duplexQuestions.push(LANDLORD_OCCUPANCY_TENANCY);
    if (rules.landlord_occupancy_tenancy > 2) {
      apartmentQuestions.push(LANDLORD_OCCUPANCY_TENANCY);
    }
  }
  if (rules.landlord_occupancy_1year) {
    duplexQuestions.push(LANDLORD_OCCUPANCY_1YEAR);
    if (rules.landlord_occupancy_1year > 2) {
      apartmentQuestions.push(LANDLORD_OCCUPANCY_1YEAR);
    }
  }

  // Duplex questions
  if (rules.berkeley_duplex) {
    duplexQuestions.push(BERKELEY_DUPLEX);
  }
  if (rules.duplex_attached) {
    duplexQuestions.push(DUPLEX_ATTACHED);
  }
  if (rules.duplex_building) {
    duplexQuestions.push(DUPLEX_BUILDING);
  }

  // Add questions
  if (hotelQuestions.length > 0) {
    Object.assign(eligibilityQuestions, {
      [BuildingType.Hotel]: hotelQuestions,
    });
  }
  if (apartmentQuestions.length > 0) {
    Object.assign(eligibilityQuestions, {
      [BuildingType.Apartment]: apartmentQuestions,
    });
  }
  if (duplexQuestions.length > 0) {
    Object.assign(eligibilityQuestions, {
      [BuildingType.Duplex]: duplexQuestions,
    });
  }
  if (condoSFHQuestions.length > 0) {
    Object.assign(eligibilityQuestions, {
      [BuildingType.SFH]: condoSFHQuestions,
    });
    Object.assign(eligibilityQuestions, {
      [BuildingType.Condo]: condoSFHQuestions,
    });
  }

  return eligibilityQuestions;
}

//
// Abstraction layer for converting raw eligiblity json file to structured data.
//
function EligibilityMatrix() {
  const now = new Date();
  const nowMillis = Date.UTC(
    now.getUTCFullYear() - 15,
    now.getUTCMonth(),
    now.getUTCDate(),
  );

  const undefinedRuleset: EligibilityRules = {
    builtBeforeMillis: Date.UTC(0, 0, 0, 0, 0, 0),
    passingBuildingTypes: [],
    eligibilityQuestions: {},
    subsidizedExemptions: { sec8: '', lihtc: '' },
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
    Object.assign(ruleset, {
      subsidizedExemptions: getSubsidizedExemptions(
        (eligibility as any)[geography],
      ),
    });

    if (geography === 'Statewide') {
      const now = new Date();
      Object.assign(ruleset, {
        builtBeforeMillis: nowMillis,
      });

      Object.assign(matrix, { statewide: ruleset });
    } else {
      const dateString = (eligibility as any)[geography].construction_date;

      Object.assign(ruleset, {
        builtBeforeMillis: dateString ? Date.parse(dateString) : nowMillis,
      });

      Object.assign(matrix.local, { [geography]: ruleset });
    }
  });

  return matrix;
}

export default EligibilityMatrix;
