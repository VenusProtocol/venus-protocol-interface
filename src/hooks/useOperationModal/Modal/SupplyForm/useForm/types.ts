import { Token } from 'types';

export interface FormValues {
  fromToken: Token;
  amountTokens: string;
}

export type FormError =
  | 'INVALID_TOKEN_AMOUNT'
  | 'SUPPLY_CAP_ALREADY_REACHED'
  | 'HIGHER_THAN_SUPPLY_CAP'
  | 'HIGHER_THAN_WALLET_BALANCE'
  | 'HIGHER_THAN_WALLET_SPENDING_LIMIT'
  | 'SWAP_INSUFFICIENT_LIQUIDITY'
  | 'SWAP_WRAPPING_UNSUPPORTED'
  | 'SWAP_UNWRAPPING_UNSUPPORTED'
  | 'PRICE_IMPACT_TOO_HIGH';
