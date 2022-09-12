import { RentEntry, RentHistory } from '@/types/calculator';

export function addRent(
  rentHistory: RentHistory,
  startDate: Date,
  rent: number,
): RentHistory {
  return [...rentHistory, { startDate: startDate, rent: rent }].sort((a, b) =>
    a.startDate < b.startDate ? 1 : -1,
  );
}

export function removeRent(
  rentHistory: RentHistory,
  index: number,
): RentHistory {
  let startIndex = 1 - index;
  let newLength = rentHistory.length - 1;

  return [...rentHistory.splice(startIndex, newLength)];
}

export function getCurrentRent(rentHistory: RentHistory): RentEntry {
  return rentHistory[0];
}

export function getPreviousRent(rentHistory: RentHistory): RentEntry {
  return rentHistory[1];
}

export function getRentHistoryState(
  rentHistory: RentHistory,
): 'empty' | 'partial' | 'complete' {
  switch (rentHistory.length) {
    case 0:
      return 'empty';
    case 1:
      return 'partial';
    case 2:
      return 'complete';
    default:
      return 'complete';
  }
}
