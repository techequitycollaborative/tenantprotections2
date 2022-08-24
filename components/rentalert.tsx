import { NextPage } from 'next';
import { FullLocation } from '@/types/location';
import { RentHistory } from '@/types/calculator';
import { lookupRentCap } from '@/utils/location';

interface Props {
  location: FullLocation;
  rentHistory: RentHistory;
}

const RentAlert: NextPage<Props> = function RentAlert(props) {
  const currentRent = parseFloat(props.rentHistory.currentRent.rent);
  const previousRent = parseFloat(props.rentHistory.previousRent.rent);
  const statewideRentCap = lookupRentCap(
    props.location.statewideRentCap,
    new Date(props.rentHistory.currentRent.startDate),
  );
  const statewideMaxRent = ((1 + statewideRentCap) * previousRent).toFixed(2);

  let localRentCap = null;
  let localMaxRent = null;
  if (props.location.localRentCap) {
    localRentCap = lookupRentCap(
      props.location.localRentCap,
      new Date(props.rentHistory.currentRent.startDate),
    );
    localMaxRent = ((1 + localRentCap) * previousRent).toFixed(2);
  }

  return (
    <div>
      <p>
        {props.rentHistory.currentRent.startDate} ... ${currentRent}
      </p>
      {currentRent > statewideMaxRent || currentRent > localMaxRent ? (
        <p>
          This rent increase may be illegal if you qualify for state or local
          rent control.
        </p>
      ) : (
        <p>
          This rent increase looks legal under state and local rent control.
        </p>
      )}
      {localRentCap && (
        <>
          <p>
            {props.location.city} Max Rent: ${localMaxRent}
          </p>
          <p>
            {(localRentCap * 100).toFixed(2)}% max increase per year * $
            {previousRent} =
          </p>
        </>
      )}
      <p>Statewide Max Rent: ${statewideMaxRent}</p>
      <p>
        {(statewideRentCap * 100).toFixed(2)}% max increase per year * $
        {previousRent} =
      </p>
    </div>
  );
};

export default RentAlert;
