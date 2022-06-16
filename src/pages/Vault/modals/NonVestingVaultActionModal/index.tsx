/** @jsxImportSource @emotion/react */
import React from 'react';

import { Modal, IModalProps } from 'components';
import TransactionForm, { ITransactionFormProps } from '../../TransactionForm';

export interface INonVestingVaultActionModalProps extends ITransactionFormProps {
  title: string;
  onClose: IModalProps['handleClose'];
}

const NonVestingVaultActionModal: React.FC<INonVestingVaultActionModalProps> = ({
  onClose,
  title,
  ...transactionFormProps
}) => (
  <Modal isOpened title={title} handleClose={onClose}>
    <TransactionForm {...transactionFormProps} />
  </Modal>
);

export default NonVestingVaultActionModal;
