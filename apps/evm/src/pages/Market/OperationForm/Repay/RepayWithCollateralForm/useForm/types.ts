import type { SwapQuoteDirection, Token } from 'types';

export interface FormValues {
  direction: SwapQuoteDirection;
  collateralToken: Token;
  collateralAmountTokens: string;
  repaidAmountTokens: string;
  acknowledgeRisk: boolean;
  repayFullLoan: boolean;
}

export type FormErrorCode =
  | 'EMPTY_TOKEN_AMOUNT'
  | 'HIGHER_THAN_BORROW_BALANCE'
  | 'HIGHER_THAN_AVAILABLE_AMOUNT'
  | 'TOO_RISKY'
  | 'REQUIRES_RISK_ACKNOWLEDGEMENT'
  | 'NO_SWAP_QUOTE_FOUND'
  | 'MISSING_DATA'
  | 'SWAP_PRICE_IMPACT_TOO_HIGH';
