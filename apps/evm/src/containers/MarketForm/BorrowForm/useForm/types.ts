import type { CommonTxFormErrorCode, Token } from 'types';

export interface FormValues {
  fromToken: Token;
  amountTokens: string;
  receiveNativeToken: boolean;
  acknowledgeRisk: boolean;
}

export type FormErrorCode = CommonTxFormErrorCode | 'EMPTY_TOKEN_AMOUNT' | 'NO_COLLATERALS';
