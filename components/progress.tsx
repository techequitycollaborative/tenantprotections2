import { NextPage } from 'next';

interface Props {
  progress: string;
  margin?: string;
}

const Progress: NextPage<Props> = function Progress(props) {
  return (
    <meter
      value={props.progress}
      min="0"
      max="4"
      className={`w-full h-6 -z-10 ${props.margin}`}
    />
  );
};

export default Progress;
