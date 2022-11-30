import type { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { FullLocation, Location } from '@/types/location';
import Layout from '@/components/layout';
import LinkWrapper from '@/components/link-wrapper';

import {
  locationFromZip,
  getPathFromLocation,
  citiesFromZip,
} from '@/utils/location';
import { zipAndCityFromForm } from '@/utils/zip-and-city';

interface Props {
  location: Location | null;
}

const getServerSideProps: GetServerSideProps<Props> =
  async function getServerSideProps(context) {
    const { zip, city } = await zipAndCityFromForm(context);
    const location = !zip ? null : locationFromZip(zip, city);

    if (location?.type === 'full') {
      return {
        props: {
          location: null,
        },
        redirect: {
          destination: getPathFromLocation('calculator', location),
        },
      };
    } else {
      return {
        props: {
          ...(await serverSideTranslations(context.locale!)),
          location,
        },
      };
    }
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
          placeholder="90001"
          className="border-2 text-lg rounded border-gray outline-none p-3 my-3"
          required
          defaultValue={location?.zip}
        />
        {location?.type === 'raw' && (
          <select
            id="city"
            name="city"
            required
            className="border-2 text-lg border-gray rounded p-3"
          >
            <option value="" selected disabled>
              {t('city-select')}
            </option>
            {citiesFromZip(location.zip).map((x, i) => (
              <option value={x} key={i}>
                {x}
              </option>
            ))}
          </select>
        )}
        <button
          type="submit"
          className="bg-blue border rounded border-blue text-white text-2xl p-2 my-3 hover:bg-blue-light active:bg-blue-dark"
        >
          {t('submit')}
        </button>
        {location?.type === 'unknown' &&
          t('zip-not-found', { zip: location.zip })}
      </form>
    </Layout>
  );
};

export default Calculator;
