import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/layout';

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
  return <Layout>{t('not-eligible')}</Layout>;
};

export default Ineligible;
