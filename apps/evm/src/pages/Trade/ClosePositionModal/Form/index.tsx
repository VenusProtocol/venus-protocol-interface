import { Spinner } from 'components';
import { ReduceForm } from 'pages/Trade/ReduceForm';
import { useGetSelectedTradePosition } from 'pages/Trade/useGetSelectedTradePosition';
import { useStore } from '../store';

export const Form: React.FC = () => {
  const { data, isLoading } = useGetSelectedTradePosition();
  const selectedPosition = data?.position;

  const hideClosePositionModal = useStore(state => state.hideModal);

  if (isLoading) {
    return <Spinner />;
  }

  if (!selectedPosition) {
    hideClosePositionModal();
    return;
  }

  return <ReduceForm position={selectedPosition} closePosition />;
};
