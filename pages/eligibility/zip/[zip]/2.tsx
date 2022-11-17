import assert from 'assert';

import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { FullLocation } from '@/types/location';
import { locationFromZip } from '@/utils/location';
import Layout from '@/components/layout';
import Accordion from '@/components/accordion';
import Progress from '@/components/progress';
import EligibilityNav from '@/components/eligibility-navigation';
import LinkWrapper from '@/components/link-wrapper';

const LINK_PROPERTY_LOOKUP = 'https://www.propertyshark.com/mason/';

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
};

interface Props {
  location: FullLocation;
}

const getServerSideProps: GetServerSideProps<Props> =
  async function getServerSideProps(context) {
    const locale = context.locale!;
    const { zip } = context.query;
    assert(typeof zip === 'string');

    const location = locationFromZip(zip);

    if (location.type !== 'full') {
      return {
        props: { locale, location: null as any },
        redirect: {
          destination: '/eligibility',
        },
      };
    }

    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        location,
      },
    };
  };

export { getServerSideProps };

const BuildingDate: NextPage<Props> = function BuildingDate(props) {
  const { i18n, t } = useTranslation('common');
  const rentControlDate = props.location.localRules?.builtBeforeMillis;
  const rentCapDate = props.location.statewideRules.builtBeforeMillis;

  const rentCapDateStr = new Date(rentCapDate).toLocaleDateString(
    i18n.language,
    DATE_OPTIONS,
  );
  return (
    <Layout>
      <EligibilityNav
        backLabel={t('back')}
        backUrl={`/eligibility/zip/${props.location.zip}`}
        zip={props.location.zip}
        city={props.location.city}
        startOverLabel={t('start-over')}
        startOverUrl="/eligibility"
      />
      <Progress progress="2" />

      <h2 className="text-blue text-2xl py-4">{t('questions.when-built')}</h2>
      {typeof rentControlDate !== 'undefined' && (
        <Link href={`/eligibility/zip/${props.location.zip}/3?s=local`}>
          <button className="w-full border-2 border-blue rounded text-blue text-2xl text-center p-2 my-2 hover:font-bold active:font-bold active:bg-blue-lightest">
            {t('answers.before-date', {
              date: new Date(rentControlDate).toLocaleDateString(
                i18n.language,
                DATE_OPTIONS,
              ),
            })}
          </button>
        </Link>
      )}
      <Link href={`/eligibility/zip/${props.location.zip}/3?s=statewide`}>
        <button className="w-full border-2 border-blue rounded text-blue text-2xl text-center p-2 my-2 hover:font-bold active:font-bold active:bg-blue-lightest">
          {t('answers.before-date', {
            date: rentCapDateStr,
          })}
        </button>
      </Link>
      <Link href={`/eligibility/zip/${props.location.zip}/ineligible`}>
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
