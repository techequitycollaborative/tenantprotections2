import assert from 'assert';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect, useRef } from 'react';

import { FullLocation } from '@/types/location';
import { RentEntry, RentHistory } from '@/types/calculator';
import { locationFromZip, lookupRentCap } from '@/utils/location';
import Layout from '@/components/layout';
import RentRow from '@/components/rentrow';
import RentAlert from '@/components/rentalert';
import { addRent, getRentHistoryState } from '@/utils/calculator';

interface Props {
  location: FullLocation;
}

interface RentProps {
  location: FullLocation;
  rentHistory: RentHistory;
  translation: (s: string, args?: {}) => string;
}

interface RentUpdateProps {
  rentHistory: RentHistory;
  onAddRent: (startDate: Date, rent: number) => void;
  translation: (s: string, args?: {}) => string;
}

function RentTimeline(props: RentProps) {
  const t = props.translation;

  return (
    <div>
      <p>
        {t('zipcode', { zip: props.location.zip })}{' '}
        <i>{props.location.city}, CA</i>
      </p>
      {getRentHistoryState(props.rentHistory) !== 'empty' && (
        <p>
          {t('calculator.timeline.change')} ... {t('calculator.timeline.rent')}
        </p>
      )}
      {(props.rentHistory as Array<RentEntry>).map((x, i) => (
        <RentRow key={i} startDate={x.startDate} rent={x.rent} />
      ))}
    </div>
  );
}

function RentBox(props: RentUpdateProps) {
  const rentRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const t = props.translation;

  const handleSubmit = function (e: any) {
    e.preventDefault();

    props.onAddRent(
      new Date(startDateRef.current!.value),
      parseFloat(rentRef.current!.value),
    );

    startDateRef.current!.value = '';
    rentRef.current!.value = '';
  };

  if (getRentHistoryState(props.rentHistory) === 'complete') {
    return null;
  } else {
    return (
      <form onSubmit={handleSubmit}>
        {getRentHistoryState(props.rentHistory) === 'partial' ? (
          <p>{t('calculator.history.prev-rent')}</p>
        ) : (
          <p>{t('calculator.history.new-rent')}</p>
        )}
        <input
          id="rent"
          name="rent"
          type="text"
          inputMode="numeric"
          ref={rentRef}
          required
        />
        {getRentHistoryState(props.rentHistory) === 'partial' ? (
          <p>{t('calculator.history.prev-start')}</p>
        ) : (
          <p>{t('calculator.history.new-start')}</p>
        )}
        <input
          id="startDate"
          name="startDate"
          type="date"
          inputMode="numeric"
          ref={startDateRef}
          required
        />
        <button type="submit">{t('submit')}</button>
      </form>
    );
  }
}

function Results(props: RentProps) {
  if (getRentHistoryState(props.rentHistory) === 'complete') {
    const t = props.translation;

    return (
      <>
        <RentAlert location={props.location} rentHistory={props.rentHistory} />
        <p>{t('calculator.alert.issues')}</p>
        <Link href="/resources">{t('calculator.alert.resources')}</Link>
        <Link href="/eligibility">{t('calculator.alert.take-quiz')}</Link>
      </>
    );
  } else {
    return null;
  }
}

const getServerSideProps: GetServerSideProps<Props> =
  async function getServerSideProps(context) {
    const { zip } = context.query;
    assert(typeof zip === 'string');

    const location = locationFromZip(zip);

    if (location.type !== 'full') {
      return {
        props: { location: null as any },
        redirect: {
          destination: '/calculator',
        },
      };
    }

    return {
      props: {
        ...(await serverSideTranslations(context.locale!, ['common'])),
        location,
      },
    };
  };

export { getServerSideProps };

const Zip: NextPage<Props> = function Zip(props) {
  assert(props.location, 'Location is required');
  const [rentHistory, setRentHistory] = useState<RentHistory>([]);

  const { t } = useTranslation(['common']);

  const onAddRent = function (startDate: Date, rent: number) {
    setRentHistory(addRent(rentHistory, startDate, rent));
  };

  return (
    <Layout>
      <h2>{t('calculator.title')}</h2>
      <RentTimeline
        location={props.location}
        rentHistory={rentHistory}
        translation={t}
      />
      <RentBox
        rentHistory={rentHistory}
        onAddRent={onAddRent}
        translation={t}
      />
      <Results
        location={props.location}
        rentHistory={rentHistory}
        translation={t}
      />
    </Layout>
  );
};

export default Zip;
