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

const IneligibleBuildingType: NextPage = function IneligibleBuildingType() {
  const { t } = useTranslation('common');
  return <div>{t('not-eligible')}</div>;
};

export default IneligibleBuildingType;
