import formidable from 'formidable';
import type { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Location } from '@/types/location';
import Layout from '@/components/layout';
import LinkWrapper from '@/components/link-wrapper';

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
          destination: `calculator/zip/${zip}`,
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
const Calculator: NextPage<Props> = function Calculator({ location }) {
  const { t } = useTranslation();
  return (
    <Layout>
      <div className="w-44 h-32 md:w-80 md:h-60 mt-0 md:mt-6 relative">
        <Image
          src="/img/apartment.svg"
          alt="Protected apartments in a building with tenants standing outside"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <h1 className="text-blue text-3xl font-bold pt-4 pb-8 text-center">
        {t('calculator.title')}
      </h1>
      <div className="text-gray text-lg">
        <p className="mb-4">{t('calculator.text1')}</p>
        <p className="mb-4">
          <Trans
            i18nKey="calculator.text2"
            components={{
              link1: <LinkWrapper to="/eligibility" />,
            }}
          />
        </p>
      </div>
      <form
        action="calculator"
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
          `Could not find California ZIP Code ${location.zip}`}
      </form>
    </Layout>
  );
};

export default Calculator;
