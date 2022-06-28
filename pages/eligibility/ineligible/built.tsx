import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const getStaticProps: GetStaticProps = async function getStaticProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
    },
  };
};

export { getStaticProps };

const IneligibleBuilt: NextPage = function IneligibleBuilt() {
  const { t } = useTranslation('common');
  return <div>{t('not-eligible')}</div>;
};

export default IneligibleBuilt;