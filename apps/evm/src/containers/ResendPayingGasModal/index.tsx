import { Modal } from './Modal';
import { store } from './store';

const ResendPayingGasModal: React.FC = () => {
  const lastFailedGaslessTransaction = store.use.lastFailedGaslessTransaction();

  if (lastFailedGaslessTransaction) {
    return <Modal lastFailedGaslessTransaction={lastFailedGaslessTransaction} />;
  }
};

export default ResendPayingGasModal;
