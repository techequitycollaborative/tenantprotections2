import Link from 'next/link';

const LinkWrapper = (props: any) => {
  return (
    <Link href={props.to}>
      <a className="text-blue-lighter underline">{props.children}</a>
    </Link>
  );
};

export default LinkWrapper;
