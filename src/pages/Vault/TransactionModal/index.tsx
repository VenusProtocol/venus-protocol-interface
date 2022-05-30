/** @jsxImportSource @emotion/react */
import React from 'react';

import { TokenId } from 'types';

export interface ITransactionModalProps {
  title: string;
  submitButtonEnabledLabel: string;
  submitButtonDisabledLabel: string;
  tokenId: TokenId;
}

const TransactionModal: React.FC<ITransactionModalProps> = () => <div>Modal</div>;

export default TransactionModal;
