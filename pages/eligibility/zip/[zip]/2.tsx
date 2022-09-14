import assert from 'assert';

import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { FullLocation } from '@/types/location';
import { locationFromZip } from '@/utils/location';
import Layout from '@/components/layout';
import Accordion from '@/components/accordion';
import Progress from '@/components/progress';
import EligibilityNav from '@/components/eligibility-navigation';

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
        back={`/eligibility/zip/${props.location.zip}`}
        zip={props.location.zip}
        city={props.location.city}
        startOver="/eligibility"
      />
      <Progress progress="2" />

      <h2>{t('questions.when-built')}</h2>
      {typeof rentControlDate !== 'undefined' && (
        <Link href={`/eligibility/zip/${props.location.zip}/3?s=local`}>
          {t('answers.before-date', {
            date: new Date(rentControlDate).toLocaleDateString(
              i18n.language,
              DATE_OPTIONS,
            ),
          })}
        </Link>
      )}
      <Link href={`/eligibility/zip/${props.location.zip}/3?s=statewide`}>
        {t('answers.before-date', {
          date: rentCapDateStr,
        })}
      </Link>
      <Link href="/eligibility/ineligible">
        {t('answers.after-date', {
          date: rentCapDateStr,
        })}
      </Link>
      <Accordion
        title={t('eligibility-info.built.title')}
        content={t('eligibility-info.built.content')}
      />
    </Layout>
  );
};

export default BuildingDate;
