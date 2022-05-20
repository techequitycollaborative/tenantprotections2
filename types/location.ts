import { BuildingType } from './building';

export interface YesNoQuestion {
  i18nNamespace?: string;
  passingAnswer: 'yes' | 'no';
  promptKey: string;
  yesAnswerKey: string;
  noAnswerKey: string;
}

export type BuildingEligibilityQuestions = {
  [t in BuildingType]?: YesNoQuestion[];
};

export interface EligibilityRules {
  buildingEligibilityQuestions: BuildingEligibilityQuestions;
  builtBeforeMillis: number;
}

export interface ZipData {
  // Metropolitan Statistical Area (MSA)
  area: string;
  city: string;
  county: string;
  zip: string;
}

export interface RawLocation extends ZipData {
  type: 'raw';
}

export interface FullLocation extends ZipData {
  type: 'full';
  rentCap: EligibilityRules;
  rentControl?: EligibilityRules;
}

export interface UnknownLocation {
  type: 'unknown';
  zip: string;
}

export type Location = UnknownLocation | RawLocation | FullLocation;
