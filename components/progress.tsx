import { NextPage } from 'next';

interface Props {
  progress: string;
}

const Progress: NextPage<Props> = function Progress(props) {
  return <meter value={props.progress} min="0" max="4" />;
};

export default Progress;
