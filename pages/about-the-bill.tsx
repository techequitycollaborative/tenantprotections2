import { GetStaticProps, NextPage } from 'next';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import Layout from '@/components/layout';
import LinkWrapper from '@/components/link-wrapper';

const LINK_BILL =
  'http://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=201920200AB1482';
const LINK_CALCULATOR = '/calculator';
const LINK_HOUSING_IS_KEY = 'https://housing.ca.gov/';
const LINK_COVID_RELIEF = 'https://housing.ca.gov/covid_rr/index.html';
const LINK_COVID_RELIEF_MAP =
  'https://www.arcgis.com/apps/instant/lookup/index.html?appid=f32435102af34d24a7420ffc432a33a6';

const getStaticProps: GetStaticProps = async function getStaticProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
    },
  };
};

export { getStaticProps };

const AboutTheBill: NextPage = () => {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div>
        <h1 className="text-blue text-3xl font-bold py-8">
          {t('about-bill.title')}
        </h1>
        <p className="text-gray-dark text-lg pb-8">
          <Trans
            i18nKey="about-bill.section1.text1"
            components={{
              link1: <LinkWrapper to={LINK_BILL} />,
            }}
          />
        </p>
        <ol>
          {(
            t('about-bill.section1.items', {
              returnObjects: true,
            }) as Array<string>
          ).map((x, i) => (
            <li
              key={i}
              className="text-gray-dark text-lg pb-2 list-decimal list-outside ml-10"
            >
              {x}
            </li>
          ))}
        </ol>
        <h2 className="text-blue text-2xl font-bold py-4">
          {t('about-bill.section2.title')}
        </h2>
        <p className="text-gray-dark text-lg pb-8">
          {t('about-bill.section2.text1')}
        </p>
        <h3 className="text-blue text-xl font-bold pb-4">
          {t('about-bill.section2.list1-label')}
        </h3>
        <ol>
          {(
            t('about-bill.section2.list1-items', {
              returnObjects: true,
            }) as Array<string>
          ).map((x, i) => (
            <li
              key={i}
              className="text-gray-dark text-lg pb-2 list-decimal list-outside ml-10"
            >
              {x}
            </li>
          ))}
        </ol>
        <h3 className="text-blue text-xl font-bold py-4">
          {t('about-bill.section2.list2-label')}
        </h3>
        <ol>
          {(
            t('about-bill.section2.list2-items', {
              returnObjects: true,
            }) as Array<string>
          ).map((x, i) => (
            <li
              key={i}
              className="text-gray-dark text-lg pb-2 list-decimal list-outside ml-10"
            >
              {x}
            </li>
          ))}
        </ol>
        <h2 className="text-blue text-2xl font-bold py-4">
          {t('about-bill.section3.title')}
        </h2>
        <p className="text-gray-dark text-lg pb-8">
          {t('about-bill.section3.text1')}
        </p>
        <p className="text-gray-dark text-lg pb-8">
          <Trans
            i18nKey="about-bill.section3.text2"
            components={{
              link1: <LinkWrapper to={LINK_CALCULATOR} />,
            }}
          />
        </p>
      </div>
    </Layout>
  );
};

export default AboutTheBill;
