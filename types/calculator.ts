export interface RentHistory {
  currentRent: { startDate: Date; rent: number } | undefined;
  previousRent: { startDate: Date; rent: number } | undefined;
}
