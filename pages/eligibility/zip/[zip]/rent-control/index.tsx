import { makeBuildingTypeChooser } from '../rent-cap';

const { getServerSideProps, ChooseBuildingType } =
  makeBuildingTypeChooser('rentControl');

export { getServerSideProps };

export default ChooseBuildingType;
