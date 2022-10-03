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

const Home: NextPage = () => {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <h1 className="text-blue text-3xl font-bold py-8">{t('home.title-1')}</h1>
      {(t('home.text-1', { returnObjects: true }) as Array<string>).map(
        (x, i) => (
          <p key={i} className="text-gray-dark text-lg pb-8 text-left w-full">
            {x}
          </p>
        ),
      )}
      <Link href="/eligibility">
        <button className="w-full bg-blue border rounded border-blue text-white text-2xl p-2 my-3 hover:bg-blue-light active:bg-blue-dark">
          {t('home.button-1')}
        </button>
      </Link>
      <h2 className="text-blue text-3xl font-bold py-8 mt-8">
        {t('home.title-2')}
      </h2>
      {(t('home.text-2', { returnObjects: true }) as Array<string>).map(
        (x, i) => (
          <p key={i} className="text-gray-dark text-lg pb-8 text-left w-full">
            {x}
          </p>
        ),
      )}
      <Link href="/calculator">
        <button className="w-full bg-blue border rounded border-blue text-white text-2xl p-2 my-3 hover:bg-blue-light active:bg-blue-dark">
          {t('home.button-2')}
        </button>
      </Link>
      <h2 className="text-blue text-3xl font-bold py-8 mt-8">
        {t('home.title-3')}
      </h2>
      {(t('home.text-3', { returnObjects: true }) as Array<string>).map(
        (x, i) => (
          <p key={i} className="text-gray-dark text-lg pb-8 text-left w-full">
            {x}
          </p>
        ),
      )}
      <Link href="/resources">
        <button className="w-full bg-blue border rounded border-blue text-white text-2xl p-2 my-3 hover:bg-blue-light active:bg-blue-dark">
          {t('home.button-3')}
        </button>
      </Link>
    </Layout>
  );
};

export default Home;
