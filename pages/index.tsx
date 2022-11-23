import { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
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

const Home: NextPage = () => {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div className="w-44 h-32 md:w-80 md:h-60 mt-6 relative">
        <Image
          src="/img/calculator.svg"
          alt="Tenant pressing buttons on calculator"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <h1 className="text-blue text-3xl font-bold pt-4 pb-8 text-center">
        {t('home.title-1')}
      </h1>
      {(t('home.text-1', { returnObjects: true }) as Array<string>).map(
        (x, i) => (
          <p key={i} className="text-gray-dark text-lg pb-8 text-left w-full">
            {x}
          </p>
        ),
      )}
      <Link href="/eligibility">
        <button className="w-full bg-blue border rounded border-blue text-white text-2xl p-2 my-3 hover:bg-blue-light active:bg-blue-dark">
          {t('home.button-1')}
        </button>
      </Link>
      <div className="w-44 h-32 md:w-80 md:h-60 mt-12 relative">
        <Image
          src="/img/apartment.svg"
          alt="Protected apartments in a building with tenants standing outside"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <h2 className="text-blue text-3xl font-bold py-8 text-center">
        {t('home.title-2')}
      </h2>
      {(t('home.text-2', { returnObjects: true }) as Array<string>).map(
        (x, i) => (
          <p key={i} className="text-gray-dark text-lg pb-8 text-left w-full">
            {x}
          </p>
        ),
      )}
      <Link href="/calculator">
        <button className="w-full bg-blue border rounded border-blue text-white text-2xl p-2 my-3 hover:bg-blue-light active:bg-blue-dark">
          {t('home.button-2')}
        </button>
      </Link>
      <div className="w-44 h-32 md:w-80 md:h-60 mt-12 relative">
        <Image
          src="/img/tenant.svg"
          alt="Tenant putting paperwork into envelopes"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <h2 className="text-blue text-3xl font-bold py-8 text-center">
        {t('home.title-3')}
      </h2>
      {(t('home.text-3', { returnObjects: true }) as Array<string>).map(
        (x, i) => (
          <p key={i} className="text-gray-dark text-lg pb-8 text-left w-full">
            {x}
          </p>
        ),
      )}
      <Link href="/resources">
        <button className="w-full bg-blue border rounded border-blue text-white text-2xl p-2 mt-3 mb-12 hover:bg-blue-light active:bg-blue-dark">
          {t('home.button-3')}
        </button>
      </Link>
    </Layout>
  );
};

export default Home;
