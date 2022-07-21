import formidable from 'formidable';
import type { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Location } from '@/types/location';
import Layout from '@/components/layout';

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
          destination: `/eligibility/zip/${zip}`,
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
  return (
    <Layout>
      <form action="eligibility" method="post">
        <label htmlFor="zip">{t('zip-code')}</label>
        <input
          id="zip"
          name="zip"
          type="text"
          inputMode="numeric"
          pattern="^(?(^00000(|-0000))|(\d{5}(|-\d{4})))$"
          required
        />
        <button type="submit">{t('submit')}</button>
        {location?.type === 'unknown' &&
          `Could not find ZIP Code ${location.zip}`}
      </form>
    </Layout>
  );
};

export default Eligibility;
