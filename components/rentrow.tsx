import { NextPage } from 'next';

interface Props {
  startDate: Date;
  rent: number;
  handleClick: () => void;
}

const RentRow: NextPage<Props> = function RentEntry(props: Props) {
  return (
    <div className="flex flex-row justify-between px-4">
      {props.startDate.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })}
      <p>${props.rent}</p>
      <button onClick={props.handleClick}>
        <img
          src="/img/edit-icon.svg"
          alt="edit button"
          width="15"
          height="15"
        />
      </button>
    </div>
  );
};

export default RentRow;
