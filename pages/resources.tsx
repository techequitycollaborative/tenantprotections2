import { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import Layout from '@/components/layout';
import LinkWrapper from '@/components/link-wrapper';

const LINK_ABOUT_THE_BILL = '/about-the-bill';
const LINK_TENANTS_TOGETHER =
  'https://www.tenantstogether.org/resource-directory';
const LINK_HOUSING_NOW = 'https://www.housingnowca.org';
const LINK_KNOW_YOUR_RIGHTS = 'https://www.housingnowca.org/knowyourrights';

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
      <div className="w-44 h-32 md:w-80 md:h-60 mt-0 md:mt-6 relative">
        <Image
          src="/img/tenant.svg"
          alt="Tenant putting paperwork into envelopes"
          layout="fill"
          objectFit="cover"
          priority={true}
        />
      </div>
      <h1 className="text-blue text-3xl font-bold pt-4 pb-8">
        {t('resources.title')}
      </h1>
      <div>
        <h2 className="text-blue text-2xl font-bold py-4">
          {t('resources.section1.title')}
        </h2>
        <p className="text-gray-dark text-lg pb-8">
          <Trans
            i18nKey="resources.section1.text"
            components={{
              link1: <LinkWrapper to={LINK_ABOUT_THE_BILL} />,
            }}
          />
        </p>
        <h2 className="text-blue text-2xl font-bold py-4">
          {t('resources.section2.title')}
        </h2>
        <p className="text-gray-dark text-lg pb-8">
          {t('resources.section2.text')}
        </p>
        <h2 className="text-blue text-2xl font-bold py-4">
          {t('resources.section3.title')}
        </h2>
        <p className="text-gray-dark text-lg pb-8">
          {t('resources.section3.text')}
        </p>
        <h2 className="text-blue text-2xl font-bold py-4">
          {t('resources.section4.title')}
        </h2>
        <p className="text-gray-dark text-lg pb-8">
          <Trans
            i18nKey="resources.section4.text"
            components={{
              link1: <LinkWrapper to={LINK_TENANTS_TOGETHER} />,
            }}
          />
        </p>
        <h2 className="text-blue text-2xl font-bold py-4">
          {t('resources.section5.title')}
        </h2>
        <p className="text-gray-dark text-lg pb-8">
          <Trans
            i18nKey="resources.section5.text1"
            components={{
              link1: <LinkWrapper to={LINK_HOUSING_NOW} />,
            }}
          />
        </p>
        <p className="text-gray-dark text-lg pb-8">
          <Trans
            i18nKey="resources.section5.text2"
            components={{
              link1: <LinkWrapper to={LINK_KNOW_YOUR_RIGHTS} />,
            }}
          />
        </p>
      </div>
    </Layout>
  );
};

export default Resources;
