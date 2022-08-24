import { NextPage } from 'next';
import { FullLocation } from '@/types/location';
import { RentHistory } from '@/types/calculator';
import { lookupRentCap } from '@/utils/location';

interface Props {
  location: FullLocation;
  rentHistory: RentHistory;
}

const RentAlert: NextPage<Props> = function RentAlert(props) {
  const currentRent = props.rentHistory.currentRent!.rent;
  const previousRent = props.rentHistory.previousRent!.rent;
  const currentRentStartDate = props.rentHistory.currentRent!.startDate;
  const statewideRentCap = lookupRentCap(
    props.location.statewideRentCap,
    new Date(currentRentStartDate),
  );
  const statewideMaxRent = (1 + statewideRentCap) * previousRent;
  const statewideMaxRentDisplay = statewideMaxRent.toFixed(2);

  let localRentCap = null;
  let localMaxRent = 0;
  let localMaxRentDisplay = null;
  if (props.location.localRentCap) {
    localRentCap = lookupRentCap(
      props.location.localRentCap,
      currentRentStartDate,
    );
    localMaxRent = (1 + localRentCap) * previousRent;
    localMaxRentDisplay = localMaxRent.toFixed(2);
  }

  return (
    <div>
      <p>
        {currentRentStartDate.toString()} ... ${currentRent}
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
            {props.location.city} Max Rent: ${localMaxRentDisplay}
          </p>
          <p>
            {(localRentCap * 100).toFixed(2)}% max increase per year * $
            {previousRent} =
          </p>
        </>
      )}
      <p>Statewide Max Rent: ${statewideMaxRentDisplay}</p>
      <p>
        {(statewideRentCap * 100).toFixed(2)}% max increase per year * $
        {previousRent} =
      </p>
    </div>
  );
};

export default RentAlert;
