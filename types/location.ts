import { RawZipData } from '@/data/zipcodes.json';
import { BuildingType } from './building';

export interface YesNoQuestion {
  i18nNamespace?: string;
  passingAnswer: 'yes' | 'no';
  promptKey: string;
  promptVars?: {};
  yesAnswerKey: string;
  noAnswerKey: string;
}

export type BuildingEligibilityQuestions = {
  [t in BuildingType as string]?: YesNoQuestion[];
};

export interface EligibilityRules {
  builtBeforeMillis: number;
  passingBuildingTypes: string[];
  eligibilityQuestions: BuildingEligibilityQuestions;
}

export interface RentCapEntry {
  start: Date;
  end: Date;
  rate: number;
}

export interface RentCapHistory extends Array<RentCapEntry> {}

export interface ZipData extends RawZipData {
  // Metropolitan Statistical Area (MSA)
  area: string;
  city: string;
  county: string;
  zip: string;
}

export interface RawLocation extends RawZipData {
  readonly type: 'raw';
}

export interface FullLocation extends ZipData {
  readonly type: 'full';
  city: string;
  isUnincorporatedLA: boolean,
  statewideRules: EligibilityRules;
  localRules?: EligibilityRules | null;
  statewideRentCap: RentCapHistory;
  localRentCap?: RentCapHistory | null;
}

export interface UnknownLocation {
  readonly type: 'unknown';
  zip: string;
}

export type Location = UnknownLocation | RawLocation | FullLocation;
