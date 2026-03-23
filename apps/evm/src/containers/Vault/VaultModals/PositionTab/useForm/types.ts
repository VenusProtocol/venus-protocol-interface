import type { Token } from 'types';

export interface FormValues {
  tokenAmount: string;
  fromToken: Token;
}

export type FormErrorCode =
  | 'EMPTY_TOKEN_AMOUNT'
  | 'HIGHER_THAN_WALLET_BALANCE'
  | 'NO_SWAP_QUOTE_FOUND';

export interface FormError {
  code: FormErrorCode;
  message?: string;
}
