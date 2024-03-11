import type { Token } from 'types';

export interface FormValues {
  fromToken: Token;
  amountTokens: string;
  receiveNativeToken: boolean;
}

export type FormError =
  | 'INVALID_TOKEN_AMOUNT'
  | 'NO_COLLATERALS'
  | 'BORROW_CAP_ALREADY_REACHED'
  | 'HIGHER_THAN_BORROW_CAP'
  | 'HIGHER_THAN_BORROWABLE_AMOUNT';
