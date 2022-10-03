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
        <h1 className="text-blue text-3xl font-bold py-8">
          {t('about.title-1')}
        </h1>
        {(t('about.text-1', { returnObjects: true }) as Array<string>).map(
          (x, i) => (
            <p key={i} className="text-gray-dark text-lg pb-8">
              {x}
            </p>
          ),
        )}
        <h2 className="text-blue text-2xl font-bold py-4">
          {t('about.volunteer-title')}
        </h2>
        {(t('about.volunteer-info', { returnObjects: true }) as Array<any>).map(
          (x, i) => (
            <p key={i} className="text-gray-dark text-lg pb-8">
              {x.name + ' ' + x.url}
            </p>
          ),
        )}
        <h2 className="text-blue text-2xl font-bold py-4">
          {t('about.title-2')}
        </h2>
        {(t('about.text-2', { returnObjects: true }) as Array<string>).map(
          (x, i) => (
            <p key={i} className="text-gray-dark text-lg pb-8">
              {x}
            </p>
          ),
        )}
        <h2 className="text-blue text-2xl font-bold py-4">
          {t('about.title-3')}
        </h2>
        {(t('about.text-3', { returnObjects: true }) as Array<any>).map(
          (x, i) => (
            <div key={i}>
              <h3 className="text-blue text-xl font-bold py-2">
                <Link href={x.url}>{x.name}</Link>
              </h3>
              {x.text.map((y: String, j: number) => (
                <p key={j} className="text-gray-dark text-lg pb-8">
                  {y}
                </p>
              ))}
            </div>
          ),
        )}
      </div>
    </Layout>
  );
};

export default About;
