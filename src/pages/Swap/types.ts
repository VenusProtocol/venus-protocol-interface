import { SwapDirection, Token } from 'types';

export interface FormValues {
  fromToken: Token;
  fromTokenAmountTokens: string;
  toToken: Token;
  toTokenAmountTokens: string;
  direction: SwapDirection;
}

export type FormError =
  | 'INVALID_FROM_TOKEN_AMOUNT'
  | 'FROM_TOKEN_AMOUNT_HIGHER_THAN_USER_BALANCE'
  | 'WRAPPING_UNSUPPORTED'
  | 'UNWRAPPING_UNSUPPORTED';
