import type { Token } from 'types';

export interface FormValues {
  tokenAmount: string;
  fromToken: Token;
}

export type FormErrorCode =
  | 'EMPTY_TOKEN_AMOUNT'
  | 'HIGHER_THAN_AVAILABLE'
  | 'HIGHER_THAN_MAX_DEPOSIT'
  | 'LOWER_THAN_MIN_REQUEST'
  | 'DEPOSIT_WINDOW_CLOSED';

export interface FormError {
  code: FormErrorCode;
  message?: string;
}
