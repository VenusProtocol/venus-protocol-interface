import type BigNumber from 'bignumber.js';
import type { GetPendleSwapQuoteOutput } from 'clients/api/queries/getPendleSwapQuote';
import type { UseSendTransactionOptions } from 'hooks/useSendTransaction';
import type { Token, VToken } from 'types';

export type PendlePtVaultWithdrawInput = Record<string, unknown> & {
  swapQuote: GetPendleSwapQuoteOutput;
  fromToken: Token;
  toToken: Token;
  amountMantissa: BigNumber;
  vToken?: VToken;
};

export type Options = UseSendTransactionOptions<PendlePtVaultWithdrawInput>;

export type PendlePtVaultWithdrawAtMaturityInput = Record<string, unknown> & {
  fromToken: Token;
  toToken: Token;
  amountMantissa: BigNumber;
  vToken?: VToken;
};

export type WithdrawAtMaturityOptions =
  UseSendTransactionOptions<PendlePtVaultWithdrawAtMaturityInput>;
