import { Spinner } from 'components';
import { ReduceForm } from 'pages/YieldPlus/ReduceForm';
import { useGetSelectedYieldPlusPosition } from 'pages/YieldPlus/useGetSelectedYieldPlusPosition';
import { store } from '../store';

export const Form: React.FC = () => {
  const { data, isLoading } = useGetSelectedYieldPlusPosition();
  const selectedPosition = data?.position;

  const hideClosePositionModal = store.use.hideModal();

  if (isLoading) {
    return <Spinner />;
  }

  if (!selectedPosition) {
    hideClosePositionModal();
    return;
  }

  return <ReduceForm position={selectedPosition} closePosition />;
};
