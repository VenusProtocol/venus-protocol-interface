import type { ChainId, VToken } from '@venusprotocol/chains';
import type { Token, TxType } from 'types';
import type { Address } from 'viem';
import type { GetPoolsOutput } from '../useGetPools/types';

export interface ApiAccountHistoricalTransaction {
  id: string;
  chainId: ChainId;
  txHash: string;
  txIndex: number;
  txTimestamp: Date;
  blockNumber: string;
  txType: TxType;
  accountAddress: Address;
  contractAddress: Address;
  amountVTokenMantissa: string | null;
  amountUnderlyingMantissa: string | null;
  underlyingAddress: string;
  underlyingTokenPriceMantissa: string | null;
  yieldPlusPositionAccountAddress: string | null;
  yieldPlusLongVTokenAddress: string | null;
  yieldPlusShortVTokenAddress: string | null;
  yieldPlusDsaVTokenAddress: string | null;
  yieldPlusCycleId: string | null;
  yieldPlusEffectiveLeverageRatio: string | null;
  yieldPlusInitialPrincipalMantissa: string | null;
  yieldPlusPrincipalAmountMantissa: string | null;
  yieldPlusNewTotalPrincipalMantissa: string | null;
  yieldPlusRemainingPrincipalMantissa: string | null;
  yieldPlusShortAmountMantissa: string | null;
  yieldPlusAdditionalPrincipalMantissa: string | null;
  yieldPlusCloseFractionBps: string | null;
  yieldPlusAmountRepaidMantissa: string | null;
  yieldPlusAmountRedeemedMantissa: string | null;
  yieldPlusAmountRedeemedDsaMantissa: string | null;
  yieldPlusLongDustRedeemedMantissa: string | null;
  yieldPlusAmountConvertedToProfitMantissa: string | null;
}

export interface AmountTransaction {
  txType: TxType;
  hash: string;
  blockTimestamp: Date;
  blockNumber: string;
  accountAddress: string;
  contractAddress: string;
  chainId: ChainId;
  poolName: string;
  vTokenSymbol: string;
  amountTokens: BigNumber | undefined;
  amountCents: BigNumber | undefined;
  token: Token | VToken;
}

export interface AccountTransactionHistoryApiResponse {
  count: number;
  results: ApiAccountHistoricalTransaction[];
}

export interface GetAccountTransactionHistoryInput {
  accountAddress: string;
  chainId: ChainId;
  getPoolsData: GetPoolsOutput | undefined;
  positionAccountAddress?: Address;
  contractAddress?: Address;
  type?: number;
  page?: number;
}

export type GetAccountTransactionHistoryOutput = {
  count: number;
  transactions: AmountTransaction[];
};
