import { Spinner } from 'components';
import { useGetSelectedTradePosition } from '../useGetSelectedTradePosition';
import { ManagePositionTabs } from './ManagePositionTabs';
import { OpenForm } from './OpenForm';

export const OperationForm: React.FC = () => {
  const { data, isLoading: isGetSelectedPositionLoading } = useGetSelectedTradePosition();
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
