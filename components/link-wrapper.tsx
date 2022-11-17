import Link from 'next/link';

const LinkWrapper = (props: any) => {
  return (
    <Link href={props.to}>
      <a>{props.children}</a>
    </Link>
  );
};

export default LinkWrapper;
