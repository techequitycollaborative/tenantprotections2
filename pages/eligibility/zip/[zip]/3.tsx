import assert from 'assert';

import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from 'react';

import { FullLocation, YesNoQuestion } from '@/types/location';
import { locationFromZip } from '@/utils/location';
import Layout from '@/components/layout';
import Accordion from '@/components/accordion';
import Progress from '@/components/progress';
import EligibilityNav from '@/components/eligibility-navigation';
import { BuildingType, isBuildingType } from '@/types/building';

const ELIGIBLE_LINK = '/eligibility/eligible?s=';
const INELIGIBLE_LINK = '/eligibility/ineligible';

const LOCAL_SCOPE = 'local';
const STATEWIDE_SCOPE = 'statewide';

interface Props {
  location: FullLocation;
  scope: string;
}

interface AdditionalQuestionsSectionProps {
  localQuestions: YesNoQuestion[] | undefined;
  statewideQuestions: YesNoQuestion[] | undefined;
  statewidePass: boolean;
  baseScope: string;
}

function AdditionalQuestionsSection({
  localQuestions,
  statewideQuestions,
  statewidePass,
  baseScope,
}: AdditionalQuestionsSectionProps) {
  const router = useRouter();
  let [questions, setQuestions] = useState(
    baseScope === LOCAL_SCOPE ? localQuestions : statewideQuestions,
  );
  let [currentScope, setCurrentScope] = useState(baseScope);
  let [index, setIndex] = useState(0);
  const { t } = useTranslation('common');

  const onNextQuestion: React.MouseEventHandler<HTMLAnchorElement> = (
    event,
  ) => {
    event.preventDefault();

    if (questions && index >= questions.length - 1) {
      if (currentScope === LOCAL_SCOPE) {
        // Passed all local questions
        router.push(ELIGIBLE_LINK + LOCAL_SCOPE);
      } else {
        // Passed all statewide questions
        router.push(ELIGIBLE_LINK + STATEWIDE_SCOPE);
      }
    } else {
      setIndex(index + 1);
    }
  };

  const question = questions
    ? questions[index]
    : {
        passingAnswer: '',
        promptKey: '',
        promptVars: '',
        yesAnswerKey: '',
        noAnswerKey: '',
      };

  const onClick = function click(event: any) {
    if (question.passingAnswer === event.target.value) {
      onNextQuestion(event);
    } else if (currentScope === LOCAL_SCOPE) {
      // Failed a local question, fall back to statewide check
      if (statewidePass) {
        router.push(ELIGIBLE_LINK + STATEWIDE_SCOPE);
      } else if (statewideQuestions) {
        setQuestions(statewideQuestions);
        setCurrentScope(STATEWIDE_SCOPE);
        setIndex(0);
      } else {
        router.push(INELIGIBLE_LINK);
      }
    } else {
      // Failed statewide check
      router.push(INELIGIBLE_LINK);
    }
  };

  let accordion = undefined;
  if (question.promptKey.includes('corp-ownership')) {
    accordion = (
      <Accordion
        title={t('eligibility-info.corp-ownership.title')}
        content={t('eligibility-info.corp-ownership.content')}
      />
    );
  }

  return (
    <div>
      <p>Checking on eligibility for {currentScope} rules.</p>
      <h2 className="text-blue text-2xl py-4 flex flex-col">
        {t(question.promptKey, question.promptVars)}
        <button
          value="yes"
          onClick={onClick}
          className="w-full border-2 border-blue rounded text-blue text-2xl text-center p-2 my-2 hover:font-bold active:font-bold active:bg-blue-lightest"
        >
          {t(question.yesAnswerKey)}
        </button>
        <button
          value="no"
          onClick={onClick}
          className="w-full border-2 border-blue rounded text-blue text-2xl text-center p-2 my-2 hover:font-bold active:font-bold active:bg-blue-lightest"
        >
          {t(question.noAnswerKey)}
        </button>
      </h2>
      {accordion}
    </div>
  );
}

/**
 * Endpoint generation code for building type questions, for buildings
 * subject to rent cap or rent control. Both sets of questions have the same
 * schema, so this function exists to generate pages which choose the relevant
 * version of the page to show.
 * @returns
 */
export function makeBuildingTypeChooser() {
  const getServerSideProps: GetServerSideProps<Props> =
    async function getServerSideProps(context) {
      const locale = context.locale!;
      const { zip } = context.query;
      assert(typeof zip === 'string');

      const location = locationFromZip(zip);

      // Ensures that rent cap or rent control data is available for the given endpoint
      if (location.type !== 'full' || !location['statewideRules']) {
        return {
          props: { location: null as any },
          redirect: {
            permanent: false,
            destination: '/eligibility',
          },
        };
      }

      // Require valid query string based on construction date/location, otherwise return to last question
      const scope = context.query.s as string;
      if (
        !scope?.match(/^(statewide|local)$/) ||
        (scope === LOCAL_SCOPE && location.localRules == null)
      ) {
        return {
          redirect: {
            permanent: false,
            destination: `/eligibility/zip/${location.zip}/2`,
          },
        };
      }

      return {
        props: {
          ...(await serverSideTranslations(locale, ['common'])),
          location: location,
          scope: scope,
        },
      };
    };

  const ChooseBuildingType: NextPage<Props> = function ChooseBuildingType({
    location,
    scope,
  }) {
    const router = useRouter();
    const { t } = useTranslation('common');
    const [bldgType, setBldgType] = useState<BuildingType | undefined>(
      undefined,
    );
    const [localQuestions, setLocalQuestions] = useState<
      YesNoQuestion[] | undefined
    >(undefined);
    const [statewideQuestions, setStatewideQuestions] = useState<
      YesNoQuestion[] | undefined
    >(undefined);
    const [statewidePass, setStatewidePass] = useState(false);
    const [baseScope, setBaseScope] = useState(scope);

    function checkEligibility(selectedValue: string) {
      // Do local eligibility check/questions only if applicable
      if (scope === LOCAL_SCOPE) {
        if (location.localRules?.passingBuildingTypes.includes(selectedValue)) {
          router.push(ELIGIBLE_LINK + scope);
          return;
        } else if (location.localRules?.eligibilityQuestions[selectedValue]) {
          setLocalQuestions(
            location.localRules.eligibilityQuestions[selectedValue],
          );
        } else {
          setBaseScope(STATEWIDE_SCOPE);
        }
      }

      // Do statewide eligibility check/questions regardless of initial scope;
      // fail on local will trigger fallback to statewide check
      if (
        location.statewideRules.passingBuildingTypes.includes(selectedValue)
      ) {
        // If base scope is statewide, pass; otherwise, defer to allow local check first
        if (scope === STATEWIDE_SCOPE) {
          router.push(ELIGIBLE_LINK + scope);
          return;
        } else {
          setStatewidePass(true);
          return;
        }
      } else if (location.statewideRules.eligibilityQuestions[selectedValue]) {
        setStatewideQuestions(
          location.statewideRules.eligibilityQuestions[selectedValue],
        );
      } else {
        router.push(INELIGIBLE_LINK);
        return;
      }
    }

    const onSelect: React.ChangeEventHandler<HTMLSelectElement> =
      function onSelectBldgType(event) {
        const value = event.target.value;
        if (!value) {
          setBldgType(undefined);
          return;
        }

        assert(
          isBuildingType(value),
          `Invalid building type selected: ${value}`,
        );
        setBldgType(value);

        checkEligibility(value);
      };

    return (
      <Layout>
        <EligibilityNav
          back={`/eligibility/zip/${location.zip}/2`}
          zip={location.zip}
          city={location.city}
          startOver="/eligibility"
        />
        <Progress progress="3" />

        <h2 className="text-blue text-2xl py-4">
          {t('questions.building-type')}
        </h2>
        <select
          onChange={onSelect}
          className="w-full border-2 border-blue rounded py-4 px-4 text-blue"
        >
          <option value="" className="text-blue">
            {t('Select')}
          </option>
          <option value={BuildingType.ADU}>{t('building-types.adu')}</option>
          <option value={BuildingType.Apartment}>
            {t('building-types.apartment')}
          </option>
          <option value={BuildingType.Condo}>
            {t('building-types.condo')}
          </option>
          <option value={BuildingType.Dorm}>{t('building-types.dorm')}</option>
          <option value={BuildingType.Duplex}>
            {t('building-types.duplex')}
          </option>
          <option value={BuildingType.Hotel}>
            {t('building-types.hotel')}
          </option>
          <option value={BuildingType.Senior}>
            {t('building-types.senior')}
          </option>
          <option value={BuildingType.SFH}>{t('building-types.sfh')}</option>
        </select>
        <Accordion
          title={t('eligibility-info.types.title')}
          content={t('eligibility-info.types.content')}
        />
        {(localQuestions?.length || statewideQuestions?.length) && (
          <AdditionalQuestionsSection
            localQuestions={localQuestions}
            statewideQuestions={statewideQuestions}
            statewidePass={statewidePass}
            baseScope={baseScope}
          />
        )}
      </Layout>
    );
  };

  return { getServerSideProps, ChooseBuildingType };
}

const { getServerSideProps, ChooseBuildingType } = makeBuildingTypeChooser();

export { getServerSideProps };

export default ChooseBuildingType;
