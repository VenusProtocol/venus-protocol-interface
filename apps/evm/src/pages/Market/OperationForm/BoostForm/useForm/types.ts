import type { Token } from 'types';

export interface FormValues {
  fromToken: Token;
  toToken: Token;
  amountTokens: string;
  acknowledgeRisk: boolean;
}

export type FormErrorCode =
  | 'EMPTY_TOKEN_AMOUNT'
  | 'NO_COLLATERALS'
  | 'BORROW_CAP_ALREADY_REACHED'
  | 'HIGHER_THAN_BORROW_CAP'
  | 'HIGHER_THAN_LIQUIDITY'
  | 'HIGHER_THAN_AVAILABLE_AMOUNT'
  | 'TOO_RISKY'
  | 'REQUIRES_RISK_ACKNOWLEDGEMENT';
