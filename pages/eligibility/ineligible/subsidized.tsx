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

const IneligibleSubsidized: NextPage = function IneligibleSubsidized() {
  const { t } = useTranslation('common');
  return <div>{t('not-eligible')}</div>;
};

export default IneligibleSubsidized;
