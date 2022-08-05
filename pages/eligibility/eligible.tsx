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

const Eligible: NextPage = function Eligible() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <Progress progress="4" />
      <h2>{t('eligible.title')}</h2>
      {(t('eligible.text', { returnObjects: true }) as Array<string>).map(
        (x, i) => (
          <p key={i}>{x}</p>
        ),
      )}
      <h3>{t('eligible.footnote')}</h3>
      <Link href="/calculator">{t('eligible.button')}</Link>
    </Layout>
  );
};

export default Eligible;
