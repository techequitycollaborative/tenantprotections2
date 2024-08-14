import Layout from '@/components/layout';
import LinkWrapper from '@/components/link-wrapper';
import { Location } from '@/types/location';
import type { GetServerSideProps, NextPage } from 'next';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';

import {
  citiesFromZip,
  getPathFromLocation,
  locationFromZip,
} from '@/utils/location';
import { zipAndCityFromForm } from '@/utils/zip-and-city';
import { useState } from 'react';

// Adding in a maintenance banner message (8.14.24)
function MaintenanceBanner() {
  return (
    <div className="maintenance-banner">
      <p>
        Note: Our rent calculator is under maintenance and is currently
        impacting results from June 2024 onward. This should be back to full
        functionality soon. If you have any questions please reach out to
        info@techequity.us. Thank you for your patience!
      </p>
    </div>
  );
}

interface Props {
  serverProvidedLocation: Location | null;
}

const getServerSideProps: GetServerSideProps<Props> =
  async function getServerSideProps(context) {
    const { zip, city } = await zipAndCityFromForm(context);
    const location = !zip ? null : locationFromZip(zip, city);

    if (location?.type === 'full') {
      return {
        props: {
          serverProvidedLocation: null,
        },
        redirect: {
          destination: getPathFromLocation('calculator', location),
        },
      };
    } else {
      return {
        props: {
          ...(await serverSideTranslations(context.locale!)),
          serverProvidedLocation: location,
        },
      };
    }
  };

export { getServerSideProps };

// For validation pattern source, see:
// https://css-tricks.com/html-for-zip-codes/
const Calculator: NextPage<Props> = function Calculator({
  serverProvidedLocation,
}) {
  const { t } = useTranslation();
  const [location, setLocation] = useState(serverProvidedLocation);
  const needCitySelection = location?.type === 'raw';

  return (
    <Layout>
      {/* Maintenance Banner inserted below */}
      <MaintenanceBanner />
      <div className="w-44 h-32 md:w-80 md:h-60 mt-0 md:mt-6 relative">
        <Image
          src="/img/apartment.svg"
          alt="Protected apartments in a building with tenants standing outside"
          layout="fill"
          objectFit="cover"
          priority={true}
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
        <div className="flex">
          <input
            id="zip"
            name="zip"
            type="text"
            inputMode="numeric"
            pattern="^\d{5}?$"
            placeholder="90001"
            className="border-2 text-lg rounded border-gray outline-none p-3 my-3 
          read-only:bg-slate-50 read-only:text-gray-500 read-only:border-slate-200 read-only:shadow-none
          flex-auto"
            required
            defaultValue={location?.zip}
            readOnly={needCitySelection}
          />
          {needCitySelection && (
            <button
              onClick={() => setLocation(null)}
              className="flex-none hover:click px-2 mt-1"
            >
              <Image
                src="/img/edit-icon.svg"
                alt="edit button"
                width="15"
                height="15"
                className="m-2"
              />
            </button>
          )}
        </div>
        {location?.type === 'raw' && (
          <select
            id="city"
            name="city"
            required
            className="border-2 text-lg border-gray rounded p-3"
            defaultValue="default"
          >
            <option value="default" disabled>
              {t('city-select')}
            </option>
            {citiesFromZip(location.zip).map((x, i) => (
              <option value={x} key={i}>
                {x}
              </option>
            ))}
          </select>
        )}
        {location?.type === 'unknown' && (
          <p className="text-red-600 italic mb-4">
            *{t('zip-not-found', { zip: location.zip })}
          </p>
        )}
        <button
          type="submit"
          className="bg-blue border rounded border-blue text-white text-2xl p-2 my-3 hover:bg-blue-light active:bg-blue-dark"
        >
          {t('submit')}
        </button>
      </form>
    </Layout>
  );
};

export default Calculator;
