export interface RentEntry {
  startDate: Date;
  rent: number;
}

export interface RentHistory extends Array<RentEntry> {}
