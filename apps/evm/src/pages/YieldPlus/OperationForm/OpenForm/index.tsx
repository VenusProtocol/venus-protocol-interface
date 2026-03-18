import { Spinner } from 'components';
import { Form } from './Form';
import { useGetNewYieldPlusPosition } from './useGetNewYieldPlusPosition';

export const OpenForm: React.FC = () => {
  const {
    data: { position },
  } = useGetNewYieldPlusPosition();

  if (!position) {
    return <Spinner />;
  }

  return <Form position={position} />;
};
