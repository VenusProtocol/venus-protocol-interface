import type { CommonTxFormErrorCode, TxFormError } from 'types';

export type FormErrorCode =
  | CommonTxFormErrorCode
  | 'EMPTY_DSA_TOKEN_AMOUNT'
  | 'EMPTY_SHORT_TOKEN_AMOUNT'
  | 'HIGHER_THAN_WALLET_BALANCE'
  | 'HIGHER_THAN_WALLET_SPENDING_LIMIT';

export type FormError = TxFormError<FormErrorCode>;
