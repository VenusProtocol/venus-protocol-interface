import type { CommonTxFormErrorCode, Token } from 'types';

export interface FormValues {
  fromToken: Token;
  amountTokens: string;
  acknowledgeHighPriceImpact: boolean;
}

export type FormErrorCode =
  | CommonTxFormErrorCode
  | 'EMPTY_TOKEN_AMOUNT'
  | 'HIGHER_THAN_WALLET_BALANCE'
  | 'HIGHER_THAN_WALLET_SPENDING_LIMIT'
  | 'SWAP_PRICE_IMPACT_TOO_HIGH';
