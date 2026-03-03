import type { Token } from 'types';
import type { CommonErrorCode } from '../../types';

export interface FormValues {
  fromToken: Token;
  amountTokens: string;
  receiveNativeToken: boolean;
  acknowledgeRisk: boolean;
}

export type FormErrorCode = CommonErrorCode | 'EMPTY_TOKEN_AMOUNT' | 'NO_COLLATERALS';
