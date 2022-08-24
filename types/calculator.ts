export interface RentHistory {
  currentRent: { startDate: date; rent: float } | undefined;
  previousRent: { startDate: date; rent: float } | undefined;
}
