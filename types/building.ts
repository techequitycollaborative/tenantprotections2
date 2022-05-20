export enum BuildingType {
  ADU = 'adu',
  Apartments = 'apartments',
  Dorm = 'dorm',
  Duplex = 'duplex',
  Hotel = 'hotel',
  Senior = 'Senior',
  SFH = 'sfh',
}

const ALL_BUILDING_TYPES = new Set(Object.values(BuildingType));

export function isBuildingType(val: any): val is BuildingType {
  return ALL_BUILDING_TYPES.has(val);
}
