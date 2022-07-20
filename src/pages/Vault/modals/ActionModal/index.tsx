/** @jsxImportSource @emotion/react */
import { ConnectWallet, EnableToken, Modal, ModalProps, Spinner } from 'components';
import React from 'react';

import TransactionForm, { TransactionFormProps } from '../../TransactionForm';

export interface ActionModalProps extends Pick<ModalProps, 'handleClose'>, TransactionFormProps {
  title: ModalProps['title'];
  isInitialLoading: boolean;
  connectWalletMessage: string;
  spenderAddress?: string;
  tokenNeedsToBeEnabled?: boolean;
  enableTokenMessage?: string;
}

const ActionModal: React.FC<ActionModalProps> = ({
  handleClose,
  tokenId,
  spenderAddress,
  isInitialLoading,
  title,
  connectWalletMessage,
  tokenNeedsToBeEnabled = false,
  enableTokenMessage,
  ...otherTransactionFormProps
}) => {
  const transactionFormDom = <TransactionForm tokenId={tokenId} {...otherTransactionFormProps} />;
  const content =
    tokenNeedsToBeEnabled && !!enableTokenMessage && !!spenderAddress ? (
      <EnableToken title={enableTokenMessage} vTokenId={tokenId} spenderAddress={spenderAddress}>
        {transactionFormDom}
      </EnableToken>
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
