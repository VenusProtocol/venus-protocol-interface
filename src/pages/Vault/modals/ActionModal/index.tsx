/** @jsxImportSource @emotion/react */
import { ApproveToken, ConnectWallet, Modal, ModalProps, Spinner } from 'components';
import React from 'react';

import TransactionForm, { TransactionFormProps } from '../../TransactionForm';

export interface ActionModalProps extends Pick<ModalProps, 'handleClose'>, TransactionFormProps {
  title: ModalProps['title'];
  isInitialLoading: boolean;
  connectWalletMessage: string;
  spenderAddress?: string;
  tokenNeedsToBeApproved?: boolean;
  approveTokenMessage?: string;
}

const ActionModal: React.FC<ActionModalProps> = ({
  handleClose,
  token,
  spenderAddress,
  isInitialLoading,
  title,
  connectWalletMessage,
  tokenNeedsToBeApproved = false,
  approveTokenMessage,
  ...otherTransactionFormProps
}) => {
  const transactionFormDom = <TransactionForm token={token} {...otherTransactionFormProps} />;
  const content =
    tokenNeedsToBeApproved && !!approveTokenMessage && !!spenderAddress ? (
      <ApproveToken title={approveTokenMessage} token={token} spenderAddress={spenderAddress}>
        {transactionFormDom}
      </ApproveToken>
    ) : (
      transactionFormDom
    );

  return (
    <Modal isOpen title={title} handleClose={handleClose}>
      {isInitialLoading ? (
        <Spinner />
      ) : (
        <ConnectWallet message={connectWalletMessage}>{content}</ConnectWallet>
      )}
    </Modal>
  );
};

export default ActionModal;
