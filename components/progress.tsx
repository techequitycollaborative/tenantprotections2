interface Props {
  amount: number;
}

const Progress: NextPage = function Progress(props) {
  return <meter value={props.progress} min="0" max="4" />;
};

export default Progress;
