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
    <div className="border border-blue rounded p-6 flex flex-col bg-blue-lighter mb-3">
      <div className="flex flex-row justify-between text-blue font-medium text-lg">
        {currentRentStartDate.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        })}
        <p>${currentRent}</p>
      </div>
      {currentRent > statewideMaxRent || currentRent > localMaxRent ? (
        <p className="text-blue font-medium py-2 text-lg">
          {t('calculator.alert.illegal')}
        </p>
      ) : (
        <p className="text-blue font-medium py-2 text-lg">
          {t('calculator.alert.legal')}
        </p>
      )}
      {localRentCap != null && (
        <div className="mb-4">
          <div className="flex flex-row text-blue text-lg font-bold">
            <img
              src="/img/warning-icon.svg"
              alt="warning icon"
              className="pr-2"
            />
            {t('calculator.alert.local-max-rent', {
              city: props.location.city,
              max: localMaxRentDisplay,
            })}
          </div>
          <div className="flex flex-col pl-7">
            <p className="text-gray font-light">
              {t('calculator.alert.max-increase', {
                cap: (localRentCap * 100).toFixed(2),
                rent: previousRent,
              })}
            </p>
            <p className="border border-blue rounded text-blue text-lg font-medium px-4 py-2 my-1">
              ${localMaxRentDisplay}
            </p>
          </div>
        </div>
      )}
      <div>
        <div className="flex flex-row text-blue text-lg font-bold">
          <img
            src="/img/warning-icon.svg"
            alt="warning icon"
            className="pr-2"
          />
          {t('calculator.alert.statewide-max-rent')}
        </div>
        <div className="flex flex-col pl-7">
          <p className="text-gray font-light">
            {t('calculator.alert.max-increase', {
              cap: (statewideRentCap * 100).toFixed(2),
              rent: previousRent,
            })}
          </p>
          <p className="border border-blue rounded text-blue text-lg font-medium px-4 py-2 my-1">
            ${statewideMaxRentDisplay}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RentAlert;
