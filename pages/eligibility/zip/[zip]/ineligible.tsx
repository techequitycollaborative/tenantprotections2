import assert from 'assert';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';

import { FullLocation } from '@/types/location';
import { locationFromZip } from '@/utils/location';
import Layout from '@/components/layout';
import Progress from '@/components/progress';

interface Props {
  buildingType: string;
  location: FullLocation;
}

const getServerSideProps: GetServerSideProps =
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
      <Image
        src="/img/alert-icon.svg"
        alt="minus sign to signify ineligibility"
        width="40"
        height="40"
        className="mx-auto"
      />
      <h2 className="text-blue text-2xl font-bold mx-auto mb-6">
        {t('ineligible.title')}
      </h2>
      <div className="text-gray-dark text-lg text-justify">
        {(
          t(
            buildingType === 'subsidized'
              ? 'ineligible.text-subsidized'
              : 'ineligible.text-1',
            { returnObjects: true, city: location.city },
          ) as Array<string>
        ).map((x, i) => (
          <p
            key={i}
            dangerouslySetInnerHTML={{ __html: x }}
            className="py-2"
          ></p>
        ))}
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
