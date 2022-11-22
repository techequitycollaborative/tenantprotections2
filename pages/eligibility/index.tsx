import formidable from 'formidable';
import type { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Location } from '@/types/location';
import Layout from '@/components/layout';
import Accordion from '@/components/accordion';
import EligibilityMatrix from '@/data/eligibility-matrix';

import { locationFromZip } from '@/utils/location';

interface Props {
  location: Location | null;
}

const getServerSideProps: GetServerSideProps<Props> =
  async function getServerSideProps(context) {
    const form = formidable();
    const zip = await new Promise<string | undefined>((resolve, reject) => {
      form.parse(context.req, (err, fields) => {
        if (err) {
          return reject(err);
        }
        if (typeof fields.zip === 'string') {
          resolve(fields.zip);
        } else {
          resolve(undefined);
        }
      });
    });

    const location = typeof zip === 'undefined' ? null : locationFromZip(zip);

    if (location && 'county' in location) {
      return {
        props: {
          location: null,
        },
        redirect: {
          destination: `eligibility/zip/${zip}`,
        },
      };
    }

    return {
      props: {
        ...(await serverSideTranslations(context.locale!)),
        location,
      },
    };
  };

export { getServerSideProps };

// For validation pattern source, see:
// https://css-tricks.com/html-for-zip-codes/
const Eligibility: NextPage<Props> = function Eligibility({ location }) {
  const { t } = useTranslation();
  const eligibilityMatrix = EligibilityMatrix();
  return (
    <Layout>
      <h1 className="text-blue text-3xl font-bold py-8">
        {t('eligibility-title')}
      </h1>
      <p className="text-gray-dark text-lg pb-8">{t('zip-prompt')}</p>
      <form
        action="eligibility"
        method="post"
        className="w-full flex flex-col pt-2"
      >
        <label htmlFor="zip" className="text-blue text-2xl">
          {t('zip-label')}
        </label>
        <input
          id="zip"
          name="zip"
          type="text"
          inputMode="numeric"
          pattern="^(?(^00000(|-0000))|(\d{5}(|-\d{4})))$"
          placeholder="94110"
          className="bg-gray-lightest border rounded border-gray outline-none p-3 my-3"
          required
        />
        <button
          type="submit"
          className="bg-blue border rounded border-blue text-white text-2xl p-2 my-3 hover:bg-blue-light active:bg-blue-dark"
        >
          {t('submit')}
        </button>
        {location?.type === 'unknown' &&
          `Could not find ZIP Code ${location.zip}`}
      </form>
      <Accordion
        title={t('eligibility-more.title')}
        content={
          <div>
            <p className="mb-4">{t('eligibility-more.content')}</p>
            <ul>
              {Object.entries(eligibilityMatrix.local).map(([key, value]) => (
                <li key={key} className="list-disc list-outside ml-6 mb-2">
                  {key}
                </li>
              ))}
            </ul>
          </div>
        }
      />
    </Layout>
  );
};

export default Eligibility;
