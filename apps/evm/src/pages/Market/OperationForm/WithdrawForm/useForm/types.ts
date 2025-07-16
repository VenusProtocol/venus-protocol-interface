import type { Token } from 'types';

export interface FormValues {
  fromToken: Token;
  amountTokens: string;
  receiveNativeToken: boolean;
  acknowledgeRisk: boolean;
}

export type FormErrorCode =
  | 'EMPTY_TOKEN_AMOUNT'
  | 'HIGHER_THAN_AVAILABLE_AMOUNT'
  | 'HIGHER_THAN_LIQUIDITY'
  | 'REQUIRES_RISK_ACKNOWLEDGEMENT';
