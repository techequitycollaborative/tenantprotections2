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
}

interface RentUpdateProps {
  rentHistory: RentHistory;
  onAddRent: (startDate: Date, rent: number) => void;
}

function RentTimeline(props: RentProps) {
  return (
    <div>
      <p>
        Zipcode {props.location.zip} <i>{props.location.city}, CA</i>
      </p>
      {getRentHistoryState(props.rentHistory) !== 'empty' && (
        <p>Date of rent change Rent</p>
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
          <p>What is your previous rent?</p>
        ) : (
          <p>What is your newest rent increase?</p>
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
          <p>What is the start date of your previous rent?</p>
        ) : (
          <p>What is the start date of the rent increase?</p>
        )}
        <input
          id="startDate"
          name="startDate"
          type="date"
          inputMode="numeric"
          ref={startDateRef}
          required
        />
        <button type="submit">Next</button>
      </form>
    );
  }
}

function Results(props: RentProps) {
  if (getRentHistoryState(props.rentHistory) === 'complete') {
    return (
      <>
        <RentAlert location={props.location} rentHistory={props.rentHistory} />
        <p>Having issues with your tenancy?</p>
        <Link href="/resources">Explore our resources</Link>
        <Link href="/eligibility">Take eligibility quiz</Link>
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
      <RentTimeline location={props.location} rentHistory={rentHistory} />
      <RentBox rentHistory={rentHistory} onAddRent={onAddRent} />
      <Results location={props.location} rentHistory={rentHistory} />
    </Layout>
  );
};

export default Zip;
