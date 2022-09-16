import { NextPage } from 'next';

interface Props {
  startDate: Date;
  rent: number;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}
// Timeline entry
const RentRow: NextPage<Props> = function RentEntry(props) {
  return (
    // <div className="">
    <div className="flex flex-row justify-between px-4">
      <p>{props.startDate.toLocaleDateString()}</p>
      <p>${props.rent}</p>
      <button onClick={props.onClick}>
        <img
          src="/img/edit-icon.svg"
          alt="edit button"
          width="15"
          height="15"
        />
      </button>
    </div>
    // </div>
  );
};

export default RentRow;
