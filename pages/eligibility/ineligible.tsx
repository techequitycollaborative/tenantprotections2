import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/layout';
import Progress from '@/components/progress';

const getServerSideProps: GetServerSideProps =
  async function getServerSideProps(context) {
    return {
      props: {
        ...(await serverSideTranslations(context.locale!, ['common'])),
      },
    };
  };

export { getServerSideProps };

const Ineligible: NextPage = function Ineligible() {
  const { t } = useTranslation('common');
  return (
    <Layout>
      <Progress progress="4" />
      <h2>{t('ineligible.title')}</h2>
      {t('ineligible.text-1', { returnObjects: true }).map((x, i) => (
        <p>{x}</p>
      ))}
      <h3>{t('ineligible.subtitle')}</h3>
      {t('ineligible.text-2', { returnObjects: true }).map((x, i) => (
        <p>{x}</p>
      ))}
      <h3>{t('ineligible.footnote')}</h3>
      <Link href="/resources">{t('ineligible.button')}</Link>
    </Layout>
  );
};

export default Ineligible;
