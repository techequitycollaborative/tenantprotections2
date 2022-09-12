import assert from 'assert';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from 'react';

import { FullLocation } from '@/types/location';
import { RentEntry, RentHistory } from '@/types/calculator';
import { locationFromZip, lookupRentCap } from '@/utils/location';
import Layout from '@/components/layout';
import RentRow from '@/components/rentrow';
import RentAlert from '@/components/rentalert';
import { addRent, removeRent, getRentHistoryState } from '@/utils/calculator';

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

  const handleEdit = function (index: number) {
    props.onEditRent(index);
  };

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
        <div key={i}>
          <RentRow startDate={x.startDate} rent={x.rent} />
          <button onClick={() => handleEdit(i)}>edit</button>
        </div>
      ))}
    </div>
  );
}

function RentBox(props: RentUpdateProps) {
  //const rentRef = useRef<HTMLInputElement>(null);
  //const startDateRef = useRef<HTMLInputElement>(null);
  const [rent, setRent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [editRender, setEditRender] = useState(false);
  const [rentError, setRentError] = useState('');
  const [dateError, setDateError] = useState('');
  const t = props.translation;

  const handleSubmit = function (e: any) {
    e.preventDefault();

    if (validateForm()) {
      props.onAddRent(new Date(startDate), parseFloat(rent));

      setRent('');
      setStartDate('');
      setEditRender(false);
    }
  };

  const validateForm = function () {
    const parseRent = /(\d+)$/.test(rent) ? Number(rent) : NaN;
    const parseDate = new Date(startDate);

    const now = new Date();
    const dateMax = new Date(new Date().setFullYear(now.getFullYear() + 1));
    const dateMin = new Date(new Date().setFullYear(now.getFullYear() - 3));

    let pass = true;

    // Validate rent
    if (Number.isNaN(parseRent) || parseRent < 100 || parseRent > 9999) {
      setRentError(t('calculator.errors.rent'));
      pass = false;
    } else if (!checkRentSequence(parseRent, parseDate)) {
      setRentError(t('calculator.errors.sequence'));
      pass = false;
    } else {
      setRentError('');
    }

    // Validate date
    if (parseDate > dateMax) {
      setDateError(t('calculator.errors.date-high'));
      pass = false;
    } else if (parseDate < dateMin) {
      setDateError(t('calculator.errors.date-low'));
      pass = false;
    } else {
      setDateError('');
    }

    return pass;
  };

  const checkRentSequence = function (newRent: number, newStartDate: Date) {
    if (props.rentHistory.length > 0) {
      let prevRent = props.rentHistory[0];
      if (
        (prevRent.startDate > newStartDate && prevRent.rent <= newRent) ||
        (prevRent.startDate < newStartDate && prevRent.rent >= newRent)
      ) {
        return false;
      }
    }

    return true;
  };

  const onRentChange = function (e: any) {
    setRent(e.target.value);
  };

  const onStartDateChange = function (e: any) {
    setStartDate(e.target.value);
  };

  if (props.editRow && !editRender) {
    setStartDate(props.editRow.startDate.toISOString().split('T')[0]);
    setRent(props.editRow.rent);
    setEditRender(true);
  }

  if (getRentHistoryState(props.rentHistory) === 'complete') {
    return null;
  } else {
    return (
      <form onSubmit={handleSubmit}>
        {props.editRow && <p>You chose to edit a previously entered value.</p>}
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
          value={rent}
          onChange={onRentChange}
          required
        />
        <span>{rentError}</span>
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
          value={startDate}
          onChange={onStartDateChange}
          required
        />
        <button type="submit">{t('submit')}</button>
        <span>{dateError}</span>
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
  const [editRow, setEditRow] = useState<RentRow>(undefined);

  const { t } = useTranslation(['common']);

  const onAddRent = function (startDate: Date, rent: number) {
    setRentHistory(addRent(rentHistory, startDate, rent));
    setEditRow(undefined);
  };

  const onEditRent = function (index: number) {
    setEditRow({
      startDate: rentHistory[index].startDate,
      rent: rentHistory[index].rent,
    });
    setRentHistory(removeRent(rentHistory, index));
  };

  return (
    <Layout>
      <h2>{t('calculator.title')}</h2>
      <RentTimeline
        location={props.location}
        rentHistory={rentHistory}
        onEditRent={onEditRent}
        translation={t}
      />
      <RentBox
        rentHistory={rentHistory}
        onAddRent={onAddRent}
        translation={t}
        editRow={editRow}
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
