import rentcap from '@/data/rentcap.json';
import { BuildingType } from '@/types/building';

//
// Abstraction layer for converting raw rentcap json file to structured data.
//
function RentCapMatrix() {
  let matrix = {
    statewide: {} as any,
    local: {} as any,
  };

  Object.keys(rentcap).map((id) => {
    const entry = (rentcap as any)[id];

    if (entry.geography === 'Statewide') {
      !matrix.statewide[entry.area] &&
        Object.assign(matrix.statewide, { [entry.area]: [] });

      matrix.statewide[entry.area].push({
        start: entry.start,
        end: entry.end,
        rate: entry.max_increase,
      });
    } else {
      !matrix.local[entry.geography] &&
        Object.assign(matrix.local, { [entry.geography]: [] });

      matrix.local[entry.geography].push({
        start: entry.start,
        end: entry.end,
        rate: entry.max_increase,
      });
    }
  });

  return matrix;
}

export default RentCapMatrix;
