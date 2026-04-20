import { Spinner } from 'components';
import { useGetSelectedYieldPlusPosition } from '../useGetSelectedYieldPlusPosition';
import { ManagePositionTabs } from './ManagePositionTabs';
import { OpenForm } from './OpenForm';

export const OperationForm: React.FC = () => {
  const { data, isLoading: isGetSelectedPositionLoading } = useGetSelectedYieldPlusPosition();
  const selectedPosition = data?.position;

  const isLoading = isGetSelectedPositionLoading;

  if (isLoading) {
    return <Spinner />;
  }

  if (selectedPosition) {
    return <ManagePositionTabs position={selectedPosition} />;
  }

  return <OpenForm />;
};
