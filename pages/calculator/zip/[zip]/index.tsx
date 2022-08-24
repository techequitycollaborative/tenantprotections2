import assert from 'assert';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect, useRef } from 'react';

import { FullLocation } from '@/types/location';
import { RentHistory } from '@/types/calculator';
import { locationFromZip, lookupRentCap } from '@/utils/location';
import Layout from '@/components/layout';
import RentEntry from '@/components/rententry';
import RentAlert from '@/components/rentalert';

interface Props {
  location: FullLocation;
}

interface RentProps {
  location: FullLocation;
  rentHistory: RentHistory;
}

interface RentUpdateProps {
  rentHistory: RentHistory;
  addCurrentRent: (startDate: Date, rent: number) => void;
  addPreviousRent: (startDate: Date, rent: number) => void;
}

function RentTimeline(props: RentProps) {
  const currentRent = props.rentHistory.currentRent;
  const previousRent = props.rentHistory.previousRent;

  return (
    <div>
      <p>
        Zipcode {props.location.zip} <i>{props.location.city}, CA</i>
      </p>
      {currentRent && <p>Date of rent change Rent</p>}
      {currentRent && (
        <RentEntry startDate={currentRent.startDate} rent={currentRent.rent} />
      )}
      {previousRent && (
        <RentEntry
          startDate={previousRent.startDate}
          rent={previousRent.rent}
        />
      )}
    </div>
  );
}

function RentBox(props: RentUpdateProps) {
  const rentRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);

  const onClick = function () {
    if (props.rentHistory.currentRent) {
      props.addPreviousRent(
        new Date(startDateRef.current!.value),
        parseFloat(rentRef.current!.value),
      );
    } else {
      props.addCurrentRent(
        new Date(startDateRef.current!.value),
        parseFloat(rentRef.current!.value),
      );
    }

    startDateRef.current!.value = '';
    rentRef.current!.value = '';
  };

  if (props.rentHistory.previousRent) {
    return null;
  } else {
    return (
      <div>
        {props.rentHistory.currentRent ? (
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
        {props.rentHistory.currentRent ? (
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
        <button onClick={onClick}>Next</button>
      </div>
    );
  }
}

function Results(props: RentProps) {
  const currentRent = props.rentHistory.currentRent;
  const previousRent = props.rentHistory.previousRent;

  if (currentRent && previousRent) {
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
  const [rentHistory, setRentHistory] = useState<RentHistory>({
    currentRent: undefined,
    previousRent: undefined,
  });

  const { t } = useTranslation(['common']);

  const addCurrentRent = function (startDate: Date, rent: number) {
    let currentRent = { startDate: startDate, rent: rent };
    setRentHistory({
      currentRent: currentRent,
      previousRent: rentHistory.previousRent,
    });
  };

  const addPreviousRent = function (startDate: Date, rent: number) {
    let previousRent = { startDate: startDate, rent: rent };
    setRentHistory({
      currentRent: rentHistory.currentRent,
      previousRent: previousRent,
    });
  };

  return (
    <Layout>
      <h2>{t('calculator.title')}</h2>
      <RentTimeline location={props.location} rentHistory={rentHistory} />
      <RentBox
        rentHistory={rentHistory}
        addCurrentRent={addCurrentRent}
        addPreviousRent={addPreviousRent}
      />
      <Results location={props.location} rentHistory={rentHistory} />
    </Layout>
  );
};

export default Zip;
