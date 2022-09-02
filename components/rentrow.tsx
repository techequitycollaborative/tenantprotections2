import { NextPage } from 'next';

interface Props {
  startDate: Date;
  rent: number;
}

const RentRow: NextPage<Props> = function RentEntry(props) {
  return (
    <div>
      <p>
        {props.startDate.toString()} ... ${props.rent}
      </p>
    </div>
  );
};

export default RentRow;
