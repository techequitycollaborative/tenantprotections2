import Link from 'next/link';

const LinkWrapper = (props) => {
  return (
    <Link href={props.to}>
      <a>{props.children}</a>
    </Link>
  );
};

export default LinkWrapper;
