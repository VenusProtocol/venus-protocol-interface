import type { TransactionReceipt } from 'web3-core';

export class UiError extends Error {
  title: string;

  description?: string;

  constructor(title: string, description?: string) {
    super(title);
    this.title = title;

    if (description) {
      this.description = description;
    }
  }
}

export class InternalError extends Error {
  message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
  }
}

export class TransactionError extends Error {
  txHash: string;

  constructor(message: string, txHash: string) {
    super(message);
    this.txHash = txHash;
  }
}

export const checkForTransactionError = (receipt: TransactionReceipt) => {
  if (receipt.events?.Failure) {
    throw new TransactionError('TransactionFailure', receipt.transactionHash);
  }
  return receipt;
};
