import { NextPage } from 'next';

interface Props {
  startDate: date;
  rent: float;
}

const RentEntry: NextPage<Props> = function RentEntry(props) {
  return (
    <div>
      <p>
        {props.startDate} ... ${props.rent}
      </p>
    </div>
  );
};

export default RentEntry;
