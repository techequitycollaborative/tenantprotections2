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

interface Props {
  location: FullLocation;
}

const getServerSideProps: GetServerSideProps<Props> =
  async function getServerSideProps(context) {
    const { zip } = context.query;
    assert(typeof zip === 'string');

    const location = locationFromZip(zip);

    if (location.type !== 'full') {
      return {
        props: { location: null as any },
        redirect: {
          destination: '/eligibility',
        },
      };
    }

    return {
      props: {
        ...(await serverSideTranslations(context.locale!, ['common'])),
        location,
      },
    };
  };

export { getServerSideProps };

const Zip: NextPage<Props> = function Zip(props) {
  assert(props.location, 'Location is required');

  const { t } = useTranslation(['common']);

  return (
    <Layout>
      <Progress progress="1" />
      <EligibilityNav
        back="/eligibility"
        zip={props.location.zip}
        city={props.location.city}
        startOver="/eligibility"
      />
      <h2>{t('questions.is-subsidized')}</h2>
      <Link href={`/eligibility/ineligible`}>{t('yes')}</Link>
      <Link href={`/eligibility/zip/${props.location.zip}/2`}>{t('no')}</Link>
      <Accordion
        title={t('eligibility-info.subsidized.title')}
        content={t('eligibility-info.subsidized.content')}
      />
    </Layout>
  );
};

export default Zip;
