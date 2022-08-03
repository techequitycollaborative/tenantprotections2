export enum BuildingType {
  ADU = 'adu',
  Apartment = 'apartment',
  Condo = 'condo',
  Dorm = 'dorm',
  Duplex = 'duplex', //treated as subset of apartments with 2 units assumed
  Hotel = 'hotel',
  Senior = 'senior',
  SFH = 'sfh',
}

const ALL_BUILDING_TYPES = new Set(Object.values(BuildingType));

export function isBuildingType(val: any): val is BuildingType {
  return ALL_BUILDING_TYPES.has(val);
}
