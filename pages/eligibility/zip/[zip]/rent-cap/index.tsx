import assert from 'assert';

import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';

import { FullLocation, YesNoQuestion } from '@/types/location';
import { locationFromZip } from '@/utils/location';
import { BuildingType, isBuildingType } from '@/types/building';
import { useRouter } from 'next/router';
import Link from 'next/link';

const ELIGIBLE_LINK = '/eligibility/eligible';
const INELIGIBLE_LINK = '/elgibility/ineligible/building-type';

interface AdditionalQuestionsSectionProps {
  questions: YesNoQuestion[];
}

function AdditionalQuestionsSection({
  questions,
}: AdditionalQuestionsSectionProps) {
  const router = useRouter();
  let [index, setIndex] = useState(0);
  const { t } = useTranslation('common');

  const onNextQuestion: React.MouseEventHandler<HTMLAnchorElement> = (
    event,
  ) => {
    event.preventDefault();

    if (index >= questions.length - 1) {
      router.push(ELIGIBLE_LINK);
      return;
    } else {
      setIndex(index + 1);
    }
  };

  const question = questions[index];
  const i18nOptions = {
    ns: question.i18nNamespace,
  };
  // Yes question always comes first, so the only variability in the code
  // comes from what the links do when the user clicks them.
  const [yesHref, yesOnClick, noHref, noOnClick] =
    question.passingAnswer === 'yes'
      ? ['#', onNextQuestion, INELIGIBLE_LINK, undefined]
      : [INELIGIBLE_LINK, undefined, '#', onNextQuestion];

  return (
    <>
      <h2>
        {t(question.promptKey, i18nOptions)}
        <a href={yesHref} onClick={yesOnClick}>
          {t('yes', i18nOptions)}
        </a>
        <a href={noHref} onClick={noOnClick}>
          {t('no', i18nOptions)}
        </a>
      </h2>
    </>
  );
}

interface Props {
  location: FullLocation;
}

/**
 * Endpoint generation code for building type questions, for buildings
 * subject to rent cap or rent control. Both sets of questions have the same
 * schema, so this function exists to generate pages which choose the relevant
 * version of the page to show.
 * @returns
 */
export function makeBuildingTypeChooser(type: 'rentCap' | 'rentControl') {
  const getServerSideProps: GetServerSideProps<Props> =
    async function getServerSideProps(context) {
      const locale = context.locale!;
      const { zip } = context.query;
      assert(typeof zip === 'string');

      const location = locationFromZip(zip);

      // Ensures that rent cap or rent control data is available for the given endpoint
      if (location.type !== 'full' || !location[type]) {
        return {
          props: { location: null as any },
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

  const ChooseBuildingType: NextPage<Props> = function ChooseBuildingType({
    location,
  }) {
    const router = useRouter();
    const { t } = useTranslation('common');
    const [bldgType, setBldgType] = useState<BuildingType | undefined>(
      undefined,
    );
    const [additionalQuestions, setAdditionalQuestions] = useState<
      YesNoQuestion[] | undefined
    >(undefined);
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
        if (value === bldgType) {
          return;
        }
        setBldgType(value);

        const rules = location[type];
        assert(
          rules,
          `ZIP Code ${location.zip} does not have eligibility for the selected renter protection [type="${type}"]`,
        );

        const buildingRules = rules.buildingEligibilityQuestions[value];
        if (!buildingRules) {
          router.push(ELIGIBLE_LINK);
          return;
        }

        setAdditionalQuestions(buildingRules);
      };

    return (
      <div>
        <h2>{t('questions.building-type')}</h2>
        <select onChange={onSelect}>
          <option value="">{t('Select')}</option>
          <option value={BuildingType.ADU}>{t('buildingTypes.adu')}</option>
          <option value={BuildingType.Apartments}>
            {t('buildingTypes.apartments')}
          </option>
          <option value={BuildingType.Dorm}>{t('buildingTypes.dorm')}</option>
          <option value={BuildingType.Duplex}>
            {t('buildingTypes.duplex')}
          </option>
          <option value={BuildingType.Hotel}>{t('buildingTypes.hotel')}</option>
          <option value={BuildingType.Senior}>
            {t('buildingTypes.senior')}
          </option>
          <option value={BuildingType.SFH}>{t('buildingTypes.sfh')}</option>
        </select>
        {additionalQuestions?.length && (
          <AdditionalQuestionsSection questions={additionalQuestions} />
        )}
      </div>
    );
  };

  return { getServerSideProps, ChooseBuildingType };
}

const { getServerSideProps, ChooseBuildingType } =
  makeBuildingTypeChooser('rentCap');

export { getServerSideProps };

export default ChooseBuildingType;
