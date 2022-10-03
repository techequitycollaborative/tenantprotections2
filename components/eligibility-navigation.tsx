import { NextPage } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

interface Props {
  zip: string;
  city: string;
  backLabel: string;
  backUrl: string;
  startOverLabel: string;
  startOverUrl: string;
}

const EligibilityNav: NextPage<Props> = function EligibilityNav(props) {
  return (
    <div className="flex flex-row w-full pt-8 pb-4">
      <Link href={props.backUrl}>
        <div className="flex flex-row w-1/3 text-xl items-center text-blue space-x-2 cursor-pointer">
          <FontAwesomeIcon icon={faChevronLeft} />
          <p>{props.backLabel}</p>
        </div>
      </Link>
      <p className="w-1/3 mx-auto italic pt-2 text-blue">
        {props.zip}: {props.city}
      </p>
      <div className="flex flex-row text-xl items-center text-blue space-x-2 cursor-pointer">
        <Link href={props.startOverUrl} className="w-1/3">
          {props.startOverLabel}
        </Link>
      </div>
    </div>
  );
};

export default EligibilityNav;
