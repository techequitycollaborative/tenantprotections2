import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/layout';
import Progress from '@/components/progress';

interface Props {
  scope: string;
}

const getServerSideProps: GetServerSideProps =
  async function getServerSideProps(context) {
    let scope = context.query.s as string;
    if (!scope?.match(/^(statewide|local)$/)) {
      scope = 'statewide'; // If this is empty or malformed, default to statewide
    }

    return {
      props: {
        ...(await serverSideTranslations(context.locale!, ['common'])),
        scope: scope,
      },
    };
  };

export { getServerSideProps };

const Eligible: NextPage<Props> = function Eligible({ scope }) {
  const { t } = useTranslation('common');
  const textKey = 'eligible.' + scope + '-text';

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
        {(t(textKey, { returnObjects: true }) as Array<string>).map((x, i) => (
          <p
            key={i}
            dangerouslySetInnerHTML={{ __html: x }}
            className="py-2"
          ></p>
        ))}
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
