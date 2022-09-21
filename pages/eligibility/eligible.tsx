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
      <Progress progress="4" margin="mt-6 mb-4" />
      <img
        src="/img/success-icon.svg"
        alt="check mark to signify you are eligible"
        width="15%"
        height="15%"
        className="mx-auto"
      />
      <h2 className="text-blue text-2xl font-bold mx-auto mb-6">
        {t('eligible.title')}
      </h2>
      <div className="text-gray-dark text-lg">
        {(t('eligible.text', { returnObjects: true }) as Array<string>).map(
          (x, i) => (
            <p
              key={i}
              dangerouslySetInnerHTML={{ __html: x }}
              className="py-2"
            ></p>
          ),
        )}
      </div>
      <h3 className="text-blue text-2xl mt-6 mb-4">{t('eligible.footnote')}</h3>
      <Link href="/calculator">
        <button className="w-full bg-blue border rounded border-blue text-white text-2xl p-2 my-3 hover:bg-blue-light active:bg-blue-dark">
          {t('eligible.button')}
        </button>
      </Link>
    </Layout>
  );
};

export default Eligible;
