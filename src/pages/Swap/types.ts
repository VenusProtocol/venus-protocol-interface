import { SwapDirection, Token } from 'types';

export interface FormValues {
  fromToken: Token;
  fromTokenAmountTokens: string;
  toToken: Token;
  toTokenAmountTokens: string;
  direction: SwapDirection;
}

export type FormError = 'IS_WRAP' | 'IS_UNWRAP' | 'FROM_TOKEN_AMOUNT_HIGHER_THAN_USER_BALANCE';
