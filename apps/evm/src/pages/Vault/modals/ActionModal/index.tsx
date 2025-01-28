/** @jsxImportSource @emotion/react */
import { Modal, type ModalProps, Spinner } from 'components';
import { ConnectWallet } from 'containers/ConnectWallet';

import type { Address } from 'viem';
import TransactionForm, { type TransactionFormProps } from '../../TransactionForm';

export interface ActionModalProps extends Pick<ModalProps, 'handleClose'>, TransactionFormProps {
  title: ModalProps['title'];
  isInitialLoading: boolean;
  connectWalletMessage: string;
  spenderAddress?: Address;
  tokenNeedsToBeApproved?: boolean;
}

const ActionModal: React.FC<ActionModalProps> = ({
  handleClose,
  token,
  spenderAddress,
  isInitialLoading,
  title,
  connectWalletMessage,
  tokenNeedsToBeApproved = false,
  ...otherTransactionFormProps
}) => (
  <Modal isOpen title={title} handleClose={handleClose}>
    {isInitialLoading ? (
      <Spinner />
    ) : (
      <ConnectWallet message={connectWalletMessage}>
        <TransactionForm
          token={token}
          spenderAddress={spenderAddress}
          tokenNeedsToBeApproved={tokenNeedsToBeApproved}
          {...otherTransactionFormProps}
        />
      </ConnectWallet>
    )}
  </Modal>
);

export default ActionModal;
