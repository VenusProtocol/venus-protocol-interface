import type { Token } from 'types';

export interface FormValues {
  tokenAmount: string;
  fromToken: Token;
}

export type FormErrorCode =
  | 'EMPTY_TOKEN_AMOUNT'
  | 'HIGHER_THAN_WALLET_BALANCE'
  | 'HIGHER_THAN_AVAILABLE'
  | 'PENDLE_NO_ROUTE_FOUND'
  | 'PENDLE_AMOUNT_TOO_LOW'
  | 'PENDLE_INVALID_AMOUNT';

export interface FormError {
  code: FormErrorCode;
  message?: string;
}
