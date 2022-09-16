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
        <h1>{t('about.title-1')}</h1>
        {(t('about.text-1', { returnObjects: true }) as Array<string>).map(
          (x, i) => (
            <p key={i}>{x}</p>
          ),
        )}
        <h2>{t('about.volunteer-title')}</h2>
        {(t('about.volunteer-info', { returnObjects: true }) as Array<any>).map(
          (x, i) => (
            <p key={i}>{x.name + ' ' + x.url}</p>
          ),
        )}
        <h2>{t('about.title-2')}</h2>
        {(t('about.text-2', { returnObjects: true }) as Array<string>).map(
          (x, i) => (
            <p key={i}>{x}</p>
          ),
        )}
        <h2>{t('about.title-3')}</h2>
        {(t('about.text-3', { returnObjects: true }) as Array<any>).map(
          (x, i) => (
            <div key={i}>
              <h3>
                <Link href={x.url}>{x.name}</Link>
              </h3>
              {x.text.map((y: String, j: number) => (
                <p key={j}>{y}</p>
              ))}
            </div>
          ),
        )}
      </div>
    </Layout>
  );
};

export default About;
