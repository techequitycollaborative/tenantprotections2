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

const About: NextPage = () => {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div>
        <p>This is the about page.</p>
      </div>
    </Layout>
  );
};

export default About;
