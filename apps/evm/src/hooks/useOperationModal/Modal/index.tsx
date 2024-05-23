import { Modal, type ModalProps, TokenIconWithSymbol } from 'components';
import type { VToken } from 'types';

import { OperationForm } from 'containers/OperationForm';

export interface OperationModalProps {
  onClose: ModalProps['handleClose'];
  vToken: VToken;
  poolComptrollerAddress: string;
  initialActiveTabIndex?: number;
}

export const OperationModal: React.FC<OperationModalProps> = ({
  onClose,
  vToken,
  poolComptrollerAddress,
  initialActiveTabIndex = 0,
}) => (
  <Modal
    isOpen
    title={<TokenIconWithSymbol token={vToken.underlyingToken} className="text-lg font-semibold" />}
    handleClose={onClose}
  >
    <OperationForm
      vToken={vToken}
      poolComptrollerAddress={poolComptrollerAddress}
      onSubmitSuccess={onClose}
      initialActiveTabIndex={initialActiveTabIndex}
    />
  </Modal>
);
