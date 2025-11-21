import type { Token } from 'types';

export interface FormValues {
  direction: 'exact-in' | 'exact-out';
  collateralToken: Token;
  collateralAmountTokens: string;
  repaidAmountTokens: string;
  acknowledgeRisk: boolean;
}

export type FormErrorCode =
  | 'EMPTY_TOKEN_AMOUNT'
  | 'HIGHER_THAN_BORROW_BALANCE'
  | 'HIGHER_THAN_AVAILABLE_AMOUNT'
  | 'TOO_RISKY'
  | 'REQUIRES_RISK_ACKNOWLEDGEMENT'
  | 'NO_SWAP_QUOTE_FOUND'
  | 'MISSING_DATA';
