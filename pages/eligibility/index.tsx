import type { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { FullLocation, Location } from '@/types/location';
import Layout from '@/components/layout';
import Accordion from '@/components/accordion';
import EligibilityMatrix from '@/data/eligibility-matrix';

import {
  locationFromZip,
  getPathFromLocation,
  citiesFromZip,
} from '@/utils/location';
import { zipAndCityFromForm as zipAndCityFromForm } from '@/utils/zip-and-city';
import { Scope } from '@/types/location';

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
          destination: getPathFromLocation('eligibility', location),
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
const Eligibility: NextPage<Props> = function Eligibility({ location }) {
  const { t } = useTranslation();
  const eligibilityMatrix = EligibilityMatrix();
  return (
    <Layout>
      <div className="w-44 h-32 md:w-80 md:h-60 mt-0 md:mt-6 relative">
        <Image
          src="/img/calculator.svg"
          alt="Tenant pressing buttons on calculator"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <h1 className="text-blue text-3xl font-bold pt-4 pb-8 text-center">
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
          pattern="^\d{5}?$"
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
            <p className="mt-2">{t('eligibility-more.footer')}</p>
          </div>
        }
      />
    </Layout>
  );
};

export default Eligibility;
