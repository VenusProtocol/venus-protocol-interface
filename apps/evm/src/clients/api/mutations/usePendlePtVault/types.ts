import type BigNumber from 'bignumber.js';
import type { GetPendleSwapQuoteOutput } from 'clients/api/queries/getPendleSwapQuote';
import type { UseSendTransactionOptions } from 'hooks/useSendTransaction';
import type { Token, VToken } from 'types';
import type { Address } from 'viem';

export interface PendlePtVaultInput {
  pendlePtVaultContractAddress: Address;
  swapQuote: GetPendleSwapQuoteOutput;
  type: 'deposit' | 'withdraw' | 'redeemAtMaturity';
  fromToken: Token;
  toToken: Token;
  amountMantissa: BigNumber;
  vToken?: VToken;
}

export type TrimmedPendlePtVaultInput = Omit<PendlePtVaultInput, 'pendlePtVaultContractAddress'>;
export type Options = UseSendTransactionOptions<TrimmedPendlePtVaultInput>;
