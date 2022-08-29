import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';

import { FullLocation } from '@/types/location';
import { RentHistory } from '@/types/calculator';
import { lookupRentCap } from '@/utils/location';
import { getCurrentRent, getPreviousRent } from '@/utils/calculator';

interface Props {
  location: FullLocation;
  rentHistory: RentHistory;
}

const RentAlert: NextPage<Props> = function RentAlert(props) {
  const { t, i18n } = useTranslation('common');

  const currentRent = getCurrentRent(props.rentHistory).rent;
  const previousRent = getPreviousRent(props.rentHistory).rent;
  const currentRentStartDate = getCurrentRent(props.rentHistory).startDate;

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
        <p>{t('calculator.alert.illegal')}</p>
      ) : (
        <p>{t('calculator.alert.legal')}</p>
      )}
      {localRentCap != null && (
        <>
          <p>
            {t('calculator.alert.local-max-rent', {
              city: props.location.city,
              max: localMaxRentDisplay,
            })}
          </p>
          <p>
            {t('calculator.alert.max-increase', {
              cap: (localRentCap * 100).toFixed(2),
              rent: previousRent,
            })}
          </p>
        </>
      )}
      <p>
        {t('calculator.alert.statewide-max-rent', { max: localMaxRentDisplay })}
      </p>
      <p>
        {t('calculator.alert.max-increase', {
          cap: (statewideRentCap * 100).toFixed(2),
          rent: previousRent,
        })}
      </p>
    </div>
  );
};

export default RentAlert;
