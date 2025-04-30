import { TRANSACTION_TIMEOUT_S } from 'constants/transactionTimeout';

export const generateTransactionDeadline = () =>
  Math.trunc(new Date().getTime() / 1000) + TRANSACTION_TIMEOUT_S;
