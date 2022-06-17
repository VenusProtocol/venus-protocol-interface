/** @jsxImportSource @emotion/react */
import React from 'react';

import { Modal, IModalProps, Spinner, EnableToken, ConnectWallet } from 'components';
import TransactionForm, { ITransactionFormProps } from '../../TransactionForm';

export interface IActionModalProps extends Pick<IModalProps, 'handleClose'>, ITransactionFormProps {
  title: IModalProps['title'];
  isInitialLoading: boolean;
  connectWalletMessage: string;
  tokenNeedsToBeEnabled?: boolean;
  enableTokenMessage?: string;
}

const ActionModal: React.FC<IActionModalProps> = ({
  handleClose,
  tokenId,
  isInitialLoading,
  title,
  connectWalletMessage,
  tokenNeedsToBeEnabled = false,
  enableTokenMessage,
  ...otherTransactionFormProps
}) => {
  const transactionFormDom = <TransactionForm tokenId={tokenId} {...otherTransactionFormProps} />;
  const content =
    tokenNeedsToBeEnabled && !!enableTokenMessage ? (
      <EnableToken title={enableTokenMessage} vTokenId={tokenId}>
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
