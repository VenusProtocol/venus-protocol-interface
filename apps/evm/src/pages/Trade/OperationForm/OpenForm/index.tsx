import { Spinner } from 'components';
import { Form } from './Form';
import { useGetNewTradePosition } from './useGetNewTradePosition';

export const OpenForm: React.FC = () => {
  const {
    data: { position },
  } = useGetNewTradePosition();

  if (!position) {
    return <Spinner />;
  }

  return <Form position={position} />;
};
