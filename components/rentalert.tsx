import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';

import { FullLocation } from '@/types/location';
import { RentHistory } from '@/types/calculator';
import { lookupRentCap, unincorporatedLAOverride } from '@/utils/location';
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

  let statewideMaxRent = 0;
  let statewideMaxRentDisplay = null;
  const statewideRentCap = lookupRentCap(
    props.location.statewideRentCap,
    new Date(currentRentStartDate),
  );

  if (statewideRentCap) {
    statewideMaxRent = (1 + statewideRentCap) * previousRent;
    statewideMaxRentDisplay = statewideMaxRent.toFixed(2);
  }

  let localRentCap = undefined;
  let localMaxRent = 0;
  let localMaxRentDisplay = null;
  if (props.location.localRentCap) {
    localRentCap = lookupRentCap(
      props.location.localRentCap,
      currentRentStartDate,
    );
    if (localRentCap) {
      localMaxRent = (1 + localRentCap) * previousRent;
      localMaxRentDisplay = localMaxRent.toFixed(2);
    }
  }

  return (
    <div className="border border-blue rounded p-6 flex flex-col bg-blue-lightest mb-3">
      <div className="flex flex-row justify-between text-blue font-medium text-lg">
        {currentRentStartDate.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        })}
        <p className="font-bold pr-4">${currentRent}</p>
      </div>
      {(statewideMaxRent && currentRent > statewideMaxRent) ||
      (localMaxRent && currentRent > localMaxRent) ? (
        <p className="text-blue font-medium py-2 text-lg">
          {t('calculator.alert.illegal')}
        </p>
      ) : (
        <p className="text-blue font-medium py-2 text-lg">
          {t('calculator.alert.legal')}
        </p>
      )}
      {localRentCap != undefined && (
        <div className="mb-4">
          <div className="flex flex-row text-blue text-lg font-bold">
            <img
              src={
                currentRent > localMaxRent
                  ? '/img/warning-icon.svg'
                  : '/img/check-icon.svg'
              }
              alt="warning icon"
              className="pt-1 pr-2 absolute"
            />
            <div className="flex flex-col pl-8 pr-24">
              <p>
                {t('calculator.alert.local-max-rent', {
                  city: unincorporatedLAOverride(props.location),
                  max: localMaxRentDisplay,
                })}
              </p>
              <p className="text-gray font-light text-sm italic">
                {t('calculator.alert.max-increase', {
                  cap: (localRentCap * 100).toFixed(2),
                  rent: previousRent,
                })}
              </p>
            </div>
            <p className="border border-blue absolute rounded text-blue text-lg font-medium py-2 my-1 px-2 right-[3em] md:right-[5em] lg:px-10 lg:right-[8em]">
              ${localMaxRentDisplay}
            </p>
          </div>
        </div>
      )}
      {statewideRentCap != undefined && (
        <div className="mb-4">
          <div className="flex flex-row text-blue text-lg font-bold">
            <img
              src={
                currentRent > statewideMaxRent
                  ? '/img/warning-icon.svg'
                  : '/img/check-icon.svg'
              }
              alt="warning icon"
              className="pt-1 pr-2 absolute"
            />
            <div className="flex flex-col pl-8 pr-24">
              <p>{t('calculator.alert.statewide-max-rent')}</p>
              <p className="text-gray font-light text-sm italic">
                {t('calculator.alert.max-increase', {
                  cap: (statewideRentCap * 100).toFixed(2),
                  rent: previousRent,
                })}
              </p>
            </div>
            <p className="border border-blue absolute  rounded text-blue text-lg font-medium py-2 my-1 px-2 right-[3em] md:right-[5em] lg:px-10 lg:right-[8em]">
              ${statewideMaxRentDisplay}
            </p>
          </div>
        </div>
      )}
      <div>
        {(
          t('calculator.alert.rate-explanation', {
            returnObjects: true,
          }) as Array<string>
        ).map((x, i) => (
          <p key={i} className="text-blue font-medium py-2 text-md">
            {x}
          </p>
        ))}
        {localRentCap == undefined ? (
          <p className="text-blue font-medium py-2 text-md">
            {t('calculator.alert.rate-explanation-statewide')}
          </p>
        ) : (
          <p className="text-blue font-medium py-2 text-md">
            {t('calculator.alert.rate-explanation-local')}
          </p>
        )}
      </div>
    </div>
  );
};

export default RentAlert;
