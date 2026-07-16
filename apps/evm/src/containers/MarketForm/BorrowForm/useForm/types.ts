import type { Token } from 'types';
import type { PoolBalanceMutationsErrorCode } from 'utilities';

export interface FormValues {
  fromToken: Token;
  amountTokens: string;
  receiveNativeToken: boolean;
  acknowledgeRisk: boolean;
}

export type FormErrorCode = PoolBalanceMutationsErrorCode | 'EMPTY_TOKEN_AMOUNT' | 'NO_COLLATERALS';
