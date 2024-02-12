import { TRANSACTION_TIMEOUT_S } from 'constants/transactionTimeout';

const generateTransactionDeadline = () =>
  Math.trunc(new Date().getTime() / 1000) + TRANSACTION_TIMEOUT_S;

export default generateTransactionDeadline;
