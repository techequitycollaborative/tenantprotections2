import { NextPage } from 'next';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

import { FullLocation } from '@/types/location';
import { RentHistory } from '@/types/calculator';
import { lookupRentCap, unincorporatedLAOverride } from '@/utils/location';
import { getCurrentRent, getPreviousRent } from '@/utils/calculator';
import Accordion from '@/components/accordion';
import LinkWrapper from '@/components/link-wrapper';
import { activeMoratorium } from '@/data/moratoria';

const LOCAL_DISCLAIMER_OVERRIDES = ['Baldwin_Park', 'Los_Gatos'];

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

  const moratorium = activeMoratorium(
    unincorporatedLAOverride(props.location),
    currentRentStartDate,
  );

  const cityString = props.location.city.replaceAll(' ', '_');
  const haywardLink = (
    <LinkWrapper to="https://www.hayward-ca.gov/sites/default/files/documents/Rent-Review-Petition-Form.pdf">
      https://www.hayward-ca.gov/sites/default/files/documents/Rent-Review-Petition-Form.pdf
    </LinkWrapper>
  );
  const localDisclaimer = i18n.exists(
    'calculator.alert.more.local-disclaimer.' + cityString,
  )
    ? (
        t('calculator.alert.more.local-disclaimer.' + cityString, {
          returnObjects: true,
        }) as Array<string>
      ).map((x, i) => (
        <p key={i} className="text-gray font-medium py-2 text-md">
          {x} {cityString === 'Hayward' && i == 2 ? haywardLink : null}
        </p>
      ))
    : null;

  return (
    <>
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
              <div className="pt-1 pr-2 absolute">
                <Image
                  src={
                    currentRent > localMaxRent
                      ? '/img/warning-icon.svg'
                      : '/img/check-icon.svg'
                  }
                  alt="warning icon"
                  width="20"
                  height="20"
                />
              </div>
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
              <div className="pt-1 pr-2 absolute">
                <Image
                  src={
                    currentRent > statewideMaxRent
                      ? '/img/warning-icon.svg'
                      : '/img/check-icon.svg'
                  }
                  alt="warning icon"
                  width="20"
                  height="20"
                />
              </div>
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
          <p className="text-blue font-medium py-2 text-md">
            {t('calculator.alert.rate-explanation')}
          </p>
          {moratorium.isActive ? (
            <>
              <h2 className="text-blue py-2 text-lg font-bold">
                <div className="pb-1 pt-1 pr-2 absolute">
                  <Image
                    src="/img/warning-icon.svg"
                    alt="warning icon"
                    width="20"
                    height="20"
                  />
                </div>
                <div className="pl-8">{t('calculator.moratorium.title')}</div>
              </h2>
              <p className="text-blue font-medium py-2 text-md">
                {t('calculator.moratorium.content', {
                  city: unincorporatedLAOverride(props.location),
                  rate: moratorium.cap,
                })}
              </p>
            </>
          ) : null}
        </div>
      </div>
      <Accordion
        title={t('calculator.alert.more.title')}
        content={
          <div>
            <p>{t('calculator.alert.more.text1')}</p>
            {localRentCap == undefined ? (
              <>
                <p className="text-gray font-medium py-2 text-md">
                  {t('calculator.alert.more.text2.statewide')}
                </p>
                {LOCAL_DISCLAIMER_OVERRIDES.includes(cityString)
                  ? localDisclaimer
                  : t('calculator.alert.more.state-disclaimer')}
              </>
            ) : localDisclaimer ? (
              localDisclaimer
            ) : (
              <p className="text-gray font-medium py-2 text-md">
                {t('calculator.alert.more.text2.local')}
              </p>
            )}
          </div>
        }
      />
    </>
  );
};

export default RentAlert;
