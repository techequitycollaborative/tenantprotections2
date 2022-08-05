import Link from 'next/link';

interface Props {
  zip: string;
  city: string;
  back: string;
  startOver: string;
}

const EligibilityNav: NextPage = function EligibilityNav(props) {
  return (
    <p>
      <Link href={props.back}>Back</Link>
      &nbsp;&nbsp;
      <i>
        {props.zip}: {props.city}
      </i>
      &nbsp;&nbsp;
      <Link href={props.startOver}>Start Over</Link>
    </p>
  );
};

export default EligibilityNav;
