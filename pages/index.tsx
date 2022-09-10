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
      <div className="container">
        <p>This is the front page.</p>
        <Link href={`/eligibility`}>{t('take-quiz')}</Link>
      </div>
    </Layout>
  );
};

export default Home;
