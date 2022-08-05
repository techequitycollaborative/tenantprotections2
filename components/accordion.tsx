import { NextPage } from 'next';

interface Props {
  title: string;
  content: string;
}

const Accordion: NextPage<Props> = function Accordion(props) {
  return (
    <>
      <h3>{props.title}</h3>
      <p>{props.content}</p>
    </>
  );
};

export default Accordion;
