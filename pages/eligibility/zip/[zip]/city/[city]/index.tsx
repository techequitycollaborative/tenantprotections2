import assert from 'assert';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { FullLocation } from '@/types/location';
import { locationFromZip, getPathFromLocation } from '@/utils/location';
import Layout from '@/components/layout';
import Accordion from '@/components/accordion';
import Progress from '@/components/progress';
import EligibilityNav from '@/components/eligibility-navigation';
import { zipAndCityFromUrl } from '@/utils/zip-and-city';
import { Scope } from '@/types/location';

const ELIGIBLE = 'eligible';
const EXEMPT = 'exempt';

interface Props {
  location: FullLocation;
}

const getServerSideProps: GetServerSideProps<Props> =
  async function getServerSideProps(context) {
    const { zip, city } = zipAndCityFromUrl(context);
    const location = locationFromZip(zip, city);

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

interface AdditionalQuestionsSectionProps {
  location: FullLocation;
}

function AdditionalQuestionsSection({
  location,
}: AdditionalQuestionsSectionProps) {
  let [question, setQuestion] = useState(1);
  const { t } = useTranslation(['common']);
  const router = useRouter();

  const onClickQuestion1 = function click(event: any) {
    const answer = event.target.value;

    if (answer === 'yes') {
      if (
        location.localRules &&
        location.localRules.subsidizedExemptions.sec8 === ELIGIBLE
      ) {
        routeNextLocal();
      } else if (
        location.statewideRules.subsidizedExemptions.sec8 === ELIGIBLE
      ) {
        routeNextStatewide();
      } else {
        routeIneligible();
      }
    } else {
      if (
        (!location.localRules ||
          location.localRules.subsidizedExemptions.lihtc === EXEMPT) &&
        location.statewideRules.subsidizedExemptions.lihtc === EXEMPT
      ) {
        routeIneligible();
      } else {
        setQuestion(2);
      }
    }
  };

  const onClickQuestion2 = function click(event: any) {
    const answer = event.target.value;

    if (answer === 'yes') {
      if (
        location.localRules &&
        location.localRules.subsidizedExemptions.lihtc === ELIGIBLE
      ) {
        routeNextLocal();
      } else if (
        location.statewideRules.subsidizedExemptions.lihtc === ELIGIBLE
      ) {
        routeNextStatewide();
      } else {
        routeIneligible();
      }
    } else {
      routeIneligible();
    }
  };

  const routeNextLocal = function () {
    router.push(getPathFromLocation('/eligibility', location, '2'));
  };
  const routeNextStatewide = function () {
    router.push(
      getPathFromLocation('/eligibility', location, '2', {
        s: Scope.STATEWIDE_SCOPE,
      }),
    );
  };
  const routeIneligible = function () {
    router.push(getPathFromLocation('/eligibility', location, 'ineligible'));
  };

  return (
    <div>
      {question == 1 ? (
        <>
          <h2 className="text-blue text-2xl py-0 flex flex-col">
            {t('questions.sec8')}
            <button
              value="yes"
              onClick={onClickQuestion1}
              className="w-full border-2 border-blue rounded text-blue text-2xl text-center p-2 my-2 hover:font-bold active:font-bold active:bg-blue-lightest"
            >
              {t('yes')}
            </button>
            <button
              value="no"
              onClick={onClickQuestion1}
              className="w-full border-2 border-blue rounded text-blue text-2xl text-center p-2 my-2 hover:font-bold active:font-bold active:bg-blue-lightest"
            >
              {t('no')}
            </button>
          </h2>
          <Accordion
            title={t('eligibility-info.sec8.title')}
            content={t('eligibility-info.sec8.content')}
          />
        </>
      ) : (
        <>
          <h2 className="text-blue text-2xl py-0 flex flex-col ">
            {t('questions.lihtc')}
            <button
              value="yes"
              onClick={onClickQuestion2}
              className="w-full border-2 border-blue rounded text-blue text-2xl text-center p-2 my-2 hover:font-bold active:font-bold active:bg-blue-lightest"
            >
              {t('yes')}
            </button>
            <button
              value="no"
              onClick={onClickQuestion2}
              className="w-full border-2 border-blue rounded text-blue text-2xl text-center p-2 my-2 hover:font-bold active:font-bold active:bg-blue-lightest"
            >
              {t('no')}
            </button>
          </h2>
          <Accordion
            title={t('eligibility-info.lihtc.title')}
            content={t('eligibility-info.lihtc.content')}
          />
        </>
      )}
    </div>
  );
}

const Zip: NextPage<Props> = function Zip(props) {
  assert(props.location, 'Location is required');

  const { t } = useTranslation(['common']);

  let [yes, setYes] = useState(false);

  const onClick = function click(event: any) {
    setYes(true);
  };

  return (
    <Layout>
      <EligibilityNav
        backLabel={t('back')}
        backUrl="/eligibility"
        zip={props.location.zip}
        city={props.location.city}
        startOverLabel={t('start-over')}
        startOverUrl="/eligibility"
      />
      <Progress progress="1" />

      <h1 className="text-blue text-2xl py-4">
        {t('questions.is-subsidized')}
      </h1>
      <button
        onClick={onClick}
        className={
          'w-full border-2 border-blue rounded text-blue text-2xl p-2 my-2 hover:font-bold active:font-bold active:bg-blue-lightest' +
          (yes ? ' font-bold bg-blue-lightest text-blue-light' : '')
        }
      >
        {t('yes')}
      </button>
      <Link href={getPathFromLocation('/eligibility', props.location, '2')}>
        <button className="w-full border-2 border-blue rounded text-blue text-2xl p-2 my-2 hover:font-bold active:font-bold active:bg-blue-lightest">
          {t('no')}
        </button>
      </Link>
      <Accordion
        title={t('eligibility-info.subsidized.title')}
        content={t('eligibility-info.subsidized.content')}
      />
      {yes ? <AdditionalQuestionsSection location={props.location} /> : null}
    </Layout>
  );
};

export default Zip;
