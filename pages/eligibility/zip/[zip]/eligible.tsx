import assert from 'assert';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { format } from 'react-string-format';
import Image from 'next/image';

import { FullLocation } from '@/types/location';
import { locationFromZip } from '@/utils/location';
import Layout from '@/components/layout';
import Progress from '@/components/progress';

interface Props {
  scope: string;
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
  const { t } = useTranslation('common');
  const textKey = 'eligible.' + scope + '-text';

  return (
    <Layout>
      <Progress progress="4" margin="mt-6 mb-4" />
      <Image
        src="/img/success-icon.svg"
        alt="check mark to signify you are eligible"
        width="40"
        height="40"
        className="mx-auto"
      />
      <h2 className="text-blue text-2xl font-bold mx-auto mb-6">
        {scope === 'local'
          ? t('eligible.title-local', { city: location.city })
          : t('eligible.title-statewide')}
      </h2>
      <div className="text-gray-dark text-lg text-justify">
        {(
          t(textKey, {
            returnObjects: true,
            city: location.city,
          }) as Array<string>
        ).map((x, i) => (
          <p
            key={i}
            dangerouslySetInnerHTML={{ __html: x }}
            className="py-2"
          ></p>
        ))}
      </div>
      <h3 className="text-blue text-2xl mt-6 mb-4">{t('eligible.footnote')}</h3>
      <Link href={`/calculator/zip/${location.zip}`}>
        <button className="w-full bg-blue border rounded border-blue text-white text-2xl p-2 my-3 hover:bg-blue-light active:bg-blue-dark">
          {t('eligible.button')}
        </button>
      </Link>
    </Layout>
  );
};

export default Eligible;
