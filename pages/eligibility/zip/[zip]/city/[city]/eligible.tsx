import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { FullLocation } from '@/types/location';
import {
  locationFromZip,
  getPathFromLocation,
  unincorporatedLAOverride,
} from '@/utils/location';
import Layout from '@/components/layout';
import Progress from '@/components/progress';
import { zipAndCityFromUrl } from '@/utils/zip-and-city';
import LinkWrapper from '@/components/link-wrapper';

const THOUSAND_OAKS_LINK =
  'https://www.toaks.org/departments/city-clerk/boards-commissions/rent-adjustment-commission';

interface Props {
  scope: string;
  location: FullLocation;
}

const getServerSideProps: GetServerSideProps =
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

    let scope = context.query.s as string;
    if (!scope?.match(/^(statewide|local)$/)) {
      scope = 'statewide'; // If this is empty or malformed, default to statewide
    }

    return {
      props: {
        ...(await serverSideTranslations(context.locale!, ['common'])),
        scope,
        location,
      },
    };
  };

export { getServerSideProps };

const Eligible: NextPage<Props> = function Eligible({ location, scope }) {
  const { t, i18n } = useTranslation('common');
  const textKey = 'eligible.' + scope + '-text';

  const cityString = location.city.replaceAll(' ', '_');
  const localDisclaimer = i18n.exists(
    'eligibility-disclaimers.covered.' + cityString,
  )
    ? t('eligibility-disclaimers.covered.' + cityString)
    : null;
  const specialDisclaimer = i18n.exists(
    'eligibility-disclaimers.special.' + cityString,
  ) ? (
    <Trans
      i18nKey={'eligibility-disclaimers.special.' + cityString}
      components={{
        link1: <LinkWrapper to={THOUSAND_OAKS_LINK} />,
      }}
    />
  ) : null;

  return (
    <Layout>
      <Progress progress="4" margin="mt-6 mb-4" />
      <img
        src="/img/success-icon.svg"
        alt="check mark to signify you are eligible"
        width="15%"
        height="15%"
        className="mx-auto"
      />
      <h2 className="text-blue text-2xl font-bold mx-auto mb-6">
        {scope === 'local'
          ? t('eligible.title-local', {
              city: unincorporatedLAOverride(location),
            })
          : t('eligible.title-statewide')}
      </h2>
      <div className="text-gray-dark text-lg text-justify">
        {(
          t(textKey, {
            returnObjects: true,
            city: unincorporatedLAOverride(location),
          }) as Array<string>
        ).map((x, i) => (
          <p
            key={i}
            dangerouslySetInnerHTML={{ __html: x }}
            className="py-2"
          ></p>
        ))}
      </div>
      {scope === 'local' && localDisclaimer ? (
        <p className="py-2 text-gray-dark text-lg text-justify">
          {localDisclaimer}
        </p>
      ) : scope === 'statewide' && specialDisclaimer ? (
        <p className="py-2 text-gray-dark text-lg text-justify">
          {specialDisclaimer}
        </p>
      ) : null}
      <h3 className="text-blue text-2xl mt-6 mb-4">{t('eligible.footnote')}</h3>
      <Link href={getPathFromLocation('/calculator', location)}>
        <button className="w-full bg-blue border rounded border-blue text-white text-2xl p-2 my-3 hover:bg-blue-light active:bg-blue-dark">
          {t('eligible.button')}
        </button>
      </Link>
    </Layout>
  );
};

export default Eligible;
