import { Spinner } from 'components';
import { useGetSelectedYieldPosition } from '../useGetSelectedYieldPosition';
import { ManagePositionTabs } from './ManagePositionTabs';
import { OpenForm } from './OpenForm';

export const OperationForm: React.FC = () => {
  const { data, isLoading: isGetSelectedYieldPositionLoading } = useGetSelectedYieldPosition();
  const selectedYieldPosition = data?.position;

  const isLoading = isGetSelectedYieldPositionLoading;

  if (isLoading) {
    return <Spinner />;
  }

  if (selectedYieldPosition) {
    return <ManagePositionTabs position={selectedYieldPosition} />;
  }

  return <OpenForm />;
};
