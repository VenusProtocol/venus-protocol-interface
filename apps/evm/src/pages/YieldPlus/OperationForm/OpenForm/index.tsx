import { Spinner } from 'components';
import { Form } from './Form';
import { useGetNewPosition } from './useGetNewPosition';

export const OpenForm: React.FC = () => {
  const {
    data: { position },
  } = useGetNewPosition();

  if (!position) {
    return <Spinner />;
  }

  return <Form position={position} />;
};
