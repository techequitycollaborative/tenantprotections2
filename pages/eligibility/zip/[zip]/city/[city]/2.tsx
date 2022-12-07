import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { FullLocation } from '@/types/location';
import { locationFromZip, getPathFromLocation } from '@/utils/location';
import Layout from '@/components/layout';
import Accordion from '@/components/accordion';
import Progress from '@/components/progress';
import EligibilityNav from '@/components/eligibility-navigation';
import LinkWrapper from '@/components/link-wrapper';
import { zipAndCityFromUrl } from '@/utils/zip-and-city';
import { Scope } from '@/types/location';

const LINK_PROPERTY_LOOKUP = 'https://www.propertyshark.com/mason/';

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
};

interface Props {
  location: FullLocation;
  scope: Scope | null;
}

const getServerSideProps: GetServerSideProps<Props> =
  async function getServerSideProps(context) {
    const locale = context.locale!;
    const { zip, city } = zipAndCityFromUrl(context);
    const location = locationFromZip(zip, city);

    if (location.type !== 'full') {
      return {
        props: { locale, location: null as any, scope: null },
        redirect: {
          destination: '/eligibility',
        },
      };
    }

    // Allow a statewide scope string
    let scope: Scope | null = null;
    if (Object.values(Scope).some((scope) => scope == context.query.s)) {
      scope = context.query.s as Scope;
    }

    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        location: location,
        scope: scope,
      },
    };
  };

export { getServerSideProps };

const BuildingDate: NextPage<Props> = function BuildingDate(props) {
  const { i18n, t } = useTranslation('common');
  const rentControlDate = props.location.localRules?.builtBeforeMillis;
  const rentCapDate = props.location.statewideRules.builtBeforeMillis;

  const rentControlDateStr =
    rentControlDate != undefined
      ? new Date(rentControlDate).toLocaleDateString(
          i18n.language,
          DATE_OPTIONS,
        )
      : '';
  const rentCapDateStr = new Date(rentCapDate).toLocaleDateString(
    i18n.language,
    DATE_OPTIONS,
  );

  const showLocalDate =
    typeof rentControlDate !== 'undefined' &&
    props.scope != Scope.STATEWIDE_SCOPE;
  const sameDateCutoff = rentControlDate && rentControlDate == rentCapDate;

  return (
    <Layout>
      <EligibilityNav
        backLabel={t('back')}
        backUrl={getPathFromLocation('/eligibility', props.location)}
        zip={props.location.zip}
        city={props.location.city}
        startOverLabel={t('start-over')}
        startOverUrl="/eligibility"
      />
      <Progress progress="2" />

      <h2 className="text-blue text-2xl py-4">{t('questions.when-built')}</h2>
      {showLocalDate && (
        <Link
          href={`${getPathFromLocation('/eligibility', props.location, '3', {
            s: 'local',
          })}`}
        >
          <button className="w-full border-2 border-blue rounded text-blue text-2xl text-center p-2 my-2 hover:font-bold active:font-bold active:bg-blue-lightest">
            {t('answers.before-date', {
              date: rentControlDateStr,
            })}
          </button>
        </Link>
      )}
      {(!sameDateCutoff || !showLocalDate) && (
        <Link
          href={`${getPathFromLocation('/eligibility', props.location, '3', {
            s: 'statewide',
          })}`}
        >
          <button className="w-full border-2 border-blue rounded text-blue text-2xl text-center p-2 my-2 hover:font-bold active:font-bold active:bg-blue-lightest">
            {!showLocalDate
              ? t('answers.before-date', { date: rentCapDateStr })
              : t('answers.between-dates', {
                  date1: rentControlDateStr,
                  date2: rentCapDateStr,
                })}
          </button>
        </Link>
      )}
      <Link
        href={`${getPathFromLocation(
          '/eligibility',
          props.location,
          'ineligible',
        )}`}
      >
        <button className="w-full border-2 border-blue rounded text-blue text-2xl text-center p-2 my-2 hover:font-bold active:font-bold active:bg-blue-lightest">
          {t('answers.after-date', {
            date: rentCapDateStr,
          })}
        </button>
      </Link>
      <Accordion
        title={t('eligibility-info.built.title')}
        content={
          <Trans
            i18nKey="eligibility-info.built.content"
            components={{
              link1: <LinkWrapper to={LINK_PROPERTY_LOOKUP} />,
            }}
          />
        }
      />
    </Layout>
  );
};

export default BuildingDate;
