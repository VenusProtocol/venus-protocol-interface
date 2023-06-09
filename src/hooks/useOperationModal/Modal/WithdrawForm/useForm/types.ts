import { Token } from 'types';

export interface FormValues {
  fromToken: Token;
  amountTokens: string;
}

export type FormError = 'INVALID_TOKEN_AMOUNT' | 'HIGHER_THAN_WITHDRAWABLE_AMOUNT';
