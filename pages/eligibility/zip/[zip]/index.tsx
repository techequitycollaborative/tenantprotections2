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
      <EligibilityNav
        back="/eligibility"
        zip={props.location.zip}
        city={props.location.city}
        startOver="/eligibility"
      />
      <Progress progress="1" />

      <h1 className="text-blue text-2xl py-4">
        {t('questions.is-subsidized')}
      </h1>
      <Link href={`/eligibility/ineligible`}>
        <button className="w-full border-2 border-blue rounded text-blue text-2xl p-2 my-2 hover:font-bold active:font-bold active:bg-blue-lightest">
          {t('yes')}
        </button>
      </Link>
      <Link href={`/eligibility/zip/${props.location.zip}/2`}>
        <button className="w-full border-2 border-blue rounded text-blue text-2xl p-2 my-2 hover:font-bold active:font-bold active:bg-blue-lightest">
          {t('no')}
        </button>
      </Link>
      <Accordion
        title={t('eligibility-info.subsidized.title')}
        content={t('eligibility-info.subsidized.content')}
      />
    </Layout>
  );
};

export default Zip;
