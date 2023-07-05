/** @jsxImportSource @emotion/react */
import { ConnectWallet, Modal, ModalProps, Spinner } from 'components';
import React from 'react';

import TransactionForm, { TransactionFormProps } from '../../TransactionForm';

export interface ActionModalProps extends Pick<ModalProps, 'handleClose'>, TransactionFormProps {
  title: ModalProps['title'];
  isInitialLoading: boolean;
  connectWalletMessage: string;
  spenderAddress?: string;
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
