import { useIosRiskModal } from 'hooks/useIosRiskModal';

import { Modal } from './Modal';
import { useStore } from './store';

const ResendPayingGasModal: React.FC = () => {
  const lastFailedGaslessTransaction = useStore(state => state.lastFailedGaslessTransaction);
  const { isOpen: isIosRiskModalOpen } = useIosRiskModal();

  if (lastFailedGaslessTransaction && !isIosRiskModalOpen) {
    return <Modal lastFailedGaslessTransaction={lastFailedGaslessTransaction} />;
  }
};

export default ResendPayingGasModal;
