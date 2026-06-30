import { Modal } from './Modal';
import { useStore } from './store';

const ResendPayingGasModal: React.FC = () => {
  const lastFailedGaslessTransaction = useStore(state => state.lastFailedGaslessTransaction);

  if (lastFailedGaslessTransaction) {
    return <Modal lastFailedGaslessTransaction={lastFailedGaslessTransaction} />;
  }
};

export default ResendPayingGasModal;
