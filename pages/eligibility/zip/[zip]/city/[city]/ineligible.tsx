import assert from 'assert';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { FullLocation } from '@/types/location';
import { locationFromZip } from '@/utils/location';
import Layout from '@/components/layout';
import Progress from '@/components/progress';
import LinkWrapper from '@/components/link-wrapper';
import { assertIsString } from '../../../../../../utils/assert';
import { zipAndCityFromUrl } from '../../../../../../utils/zip-and-city';

interface Props {
  buildingType: string;
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

    let buildingType = context.query.t as string;
    if (buildingType !== 'subsidized') {
      buildingType = ''; // If this is empty or malformed, default to blank
    }

    return {
      props: {
        ...(await serverSideTranslations(context.locale!, ['common'])),
        buildingType,
        location,
      },
    };
  };

export { getServerSideProps };

const Ineligible: NextPage<Props> = function Ineligible({
  buildingType,
  location,
}) {
  const { t } = useTranslation('common');
  return (
    <Layout>
      <Progress progress="4" margin="mt-6 mb-4" />
      <img
        src="/img/alert-icon.svg"
        alt="minus sign to signify ineligibility"
        width="15%"
        height="15%"
        className="mx-auto"
      />
      <h2 className="text-blue text-2xl font-bold mx-auto mb-6">
        {t('ineligible.title')}
      </h2>
      <div className="text-gray-dark text-lg text-justify">
        {buildingType === 'subsidized' ? (
          <>
            <p className="py-2">
              <Trans
                i18nKey="ineligible.text-subsidized-p1"
                components={{
                  bold: <span className="font-bold" />,
                }}
              />
            </p>
            <p className="py-2">
              {t('ineligible.text-subsidized-p2', {
                returnObjects: true,
                city: location.city,
              })}
            </p>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
      {buildingType === 'subsidized' ? (
        <></>
      ) : (
        <>
          <h3 className="text-blue text-2xl mt-6 mb-2">
            {t('ineligible.subtitle')}
          </h3>
          <div className="text-gray-dark text-lg mb-4 text-justify">
            {(
              t('ineligible.text-2', { returnObjects: true }) as Array<string>
            ).map((x, i) => (
              <p className="py-2" key={i}>
                {x}
              </p>
            ))}
          </div>
        </>
      )}
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
