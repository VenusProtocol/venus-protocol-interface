import type { ChainId } from '@venusprotocol/chains';
import type { Token, TxType } from 'types';
import type { Address } from 'viem';
import type { GetPoolsOutput } from '../useGetPools/types';

export interface ApiAccountHistoricalTransaction {
  id: string;
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
  chainId: ChainId;
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
  amountTokens: BigNumber | undefined;
  amountCents: BigNumber | undefined;
  token: Token;
}

export interface AccountTransactionHistoryApiResponse {
  count: number;
  results: ApiAccountHistoricalTransaction[];
}

export interface GetAccountTransactionHistoryInput {
  accountAddress: string;
  contractAddress: string;
  chainId: ChainId;
  getPoolsData: GetPoolsOutput | undefined;
  type?: number;
  page?: number;
}

export type GetAccountTransactionHistoryOutput = {
  count: number;
  transactions: AmountTransaction[];
};
