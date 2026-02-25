import type { Token } from 'types';
import type { CommonErrorCode } from '../../../types';

export interface FormValues {
  fromToken: Token;
  amountTokens: string;
  fixedRepayPercentage?: number;
  acknowledgeHighPriceImpact?: boolean;
}

export type FormErrorCode =
  | CommonErrorCode
  | 'EMPTY_TOKEN_AMOUNT'
  | 'HIGHER_THAN_REPAY_BALANCE'
  | 'HIGHER_THAN_WALLET_BALANCE'
  | 'HIGHER_THAN_WALLET_SPENDING_LIMIT'
  | 'SWAP_PRICE_IMPACT_TOO_HIGH'
  | 'MISSING_DATA';
