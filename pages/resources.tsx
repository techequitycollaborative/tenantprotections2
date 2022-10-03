import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import Layout from '@/components/layout';

const getStaticProps: GetStaticProps = async function getStaticProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
    },
  };
};

export { getStaticProps };

const Resources: NextPage = () => {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div>
        <h1 className="text-blue text-3xl font-bold py-8">
          {t('resources.title')}
        </h1>
        <h2 className="text-blue text-2xl font-bold py-4">
          {t('resources.subtitle-1')}
        </h2>
        <p className="text-gray-dark text-lg pb-8">{t('resources.text-1')}</p>
        <h2 className="text-blue text-2xl font-bold py-4">
          {t('resources.subtitle-2')}
        </h2>
        <p className="text-gray-dark text-lg pb-8">{t('resources.text-2')}</p>
        <h2 className="text-blue text-2xl font-bold py-4">
          {t('resources.subtitle-3')}
        </h2>
        <p className="text-gray-dark text-lg pb-8">
          {t('resources.text-3')}{' '}
          <Link href="https://www.tenantstogether.org/resource-directory">
            Tenants Together&apos;s Directory
          </Link>
        </p>
        <h2 className="text-blue text-2xl font-bold py-4">
          {t('resources.subtitle-4')}
        </h2>
        <p className="text-gray-dark text-lg pb-8">
          {t('resources.text-4-1')}{' '}
          <Link href="https://www.housingnowca.org">housingnowca.org</Link>
        </p>
        <p className="text-gray-dark text-lg pb-8">
          {t('resources.text-4-2')}{' '}
          <Link href="https://www.housingnowca.org/knowyourrights">
            housingnowca.org/knowyourrights
          </Link>
        </p>
      </div>
    </Layout>
  );
};

export default Resources;
