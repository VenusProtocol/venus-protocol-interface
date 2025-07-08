import type { GetSupertransactionReceiptPayloadWithReceipts } from '@biconomy/abstractjs';
import type { TransactionReceipt } from 'viem';

export type TransactionStatus = 'success' | 'failure' | undefined;

export const getTransactionStatus = ({
  transactionReceipt,
}: {
  transactionReceipt:
    | TransactionReceipt
    | GetSupertransactionReceiptPayloadWithReceipts
    | undefined;
}): TransactionStatus => {
  if (!transactionReceipt) {
    return undefined;
  }

  if ('transactionStatus' in transactionReceipt) {
    return transactionReceipt.transactionStatus === 'MINED_SUCCESS' ? 'success' : 'failure';
  }

  return transactionReceipt.status === 'success' ? 'success' : 'failure';
};
