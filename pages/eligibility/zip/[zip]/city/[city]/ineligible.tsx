import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { FullLocation } from '@/types/location';
import { locationFromZip, unincorporatedLAOverride } from '@/utils/location';
import Layout from '@/components/layout';
import Progress from '@/components/progress';
import LinkWrapper from '@/components/link-wrapper';
import { zipAndCityFromUrl } from '../../../../../../utils/zip-and-city';

const THOUSAND_OAKS_LINK =
  'https://www.toaks.org/departments/city-clerk/boards-commissions/rent-adjustment-commission';

interface Props {
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

    return {
      props: {
        ...(await serverSideTranslations(context.locale!, ['common'])),
        location,
      },
    };
  };

export { getServerSideProps };

const Ineligible: NextPage<Props> = function Ineligible({ location }) {
  const { t, i18n } = useTranslation('common');

  const cityString = location.city.replaceAll(' ', '_');
  const localDisclaimer = i18n.exists(
    'eligibility-disclaimers.not-covered.' + cityString,
  )
    ? t('eligibility-disclaimers.not-covered.' + cityString)
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
      <div className="w-16 h-16 md:w-24 md:h-24 relative">
        <Image
          src="/img/alert-icon.svg"
          alt="minus sign to signify ineligibility"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <h2 className="text-blue text-2xl font-bold mx-auto mb-6">
        {t('ineligible.title')}
      </h2>
      <div className="text-gray-dark text-lg text-justify">
        <p className="py-2">
          <Trans
            i18nKey="ineligible.text-1-p1"
            components={{
              bold: <span className="font-bold" />,
            }}
          />
        </p>
        <p className="py-2">
          <Trans
            i18nKey="ineligible.text-1-p2"
            components={{
              link1: <LinkWrapper to="/resources" />,
            }}
          />
        </p>
        {localDisclaimer ? (
          <p className="py-2">{localDisclaimer}</p>
        ) : specialDisclaimer ? (
          <p className="py-2">{specialDisclaimer}</p>
        ) : null}
      </div>
      <h3 className="text-blue text-2xl mt-6 mb-2">
        {t('ineligible.subtitle')}
      </h3>
      <div className="text-gray-dark text-lg mb-4 text-justify">
        {(t('ineligible.text-2', { returnObjects: true }) as Array<string>).map(
          (x, i) => (
            <p className="py-2" key={i}>
              {x}
            </p>
          ),
        )}
      </div>
      <h3 className="text-blue text-2xl my-4">{t('ineligible.footnote')}</h3>
      <Link href="/resources" className="">
        <button className="w-full bg-blue border rounded border-blue text-white text-2xl p-2 my-3 hover:bg-blue-light active:bg-blue-dark">
          {t('ineligible.button')}
        </button>
      </Link>
    </Layout>
  );
};

export default Ineligible;
