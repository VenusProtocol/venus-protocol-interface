import type { Token } from 'types';
import type { PoolBalanceMutationsErrorCode } from 'utilities';

export interface FormValues {
  fromToken: Token;
  amountTokens: string;
  acknowledgeHighPriceImpact: boolean;
}

export type FormErrorCode =
  | PoolBalanceMutationsErrorCode
  | 'EMPTY_TOKEN_AMOUNT'
  | 'HIGHER_THAN_WALLET_BALANCE'
  | 'HIGHER_THAN_WALLET_SPENDING_LIMIT'
  | 'SWAP_PRICE_IMPACT_TOO_HIGH';
