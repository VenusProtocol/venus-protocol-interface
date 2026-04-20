import type { ChainId } from '@venusprotocol/chains';
import type { Asset, Tx, TxType } from 'types';
import type { Address } from 'viem';
import type { GetPoolsOutput } from '../useGetPools/types';

export type ApiTxType =
  | 'principal_supplied'
  | 'principal_withdrawn'
  | 'position_opened_with_principal'
  | 'position_closed_with_profit_and_deactivated'
  | 'position_closed_with_loss_and_deactivated'
  | 'position_closed_with_profit'
  | 'position_closed_with_loss'
  | 'position_scaled'
  | 'profit_converted'
  | 'mint'
  | 'borrow'
  | 'redeem'
  | 'repay'
  | 'enter_market'
  | 'exit_market';

export interface ApiAccountHistoricalTransaction {
  id: string;
  chainId: ChainId;
  txHash: string;
  txIndex: number;
  txTimestamp: Date;
  blockNumber: string;
  txType: ApiTxType;
  accountAddress: Address;
  contractAddress: Address;
  amountVTokenMantissa: string | null;
  amountUnderlyingMantissa: string | null;
  underlyingAddress: Address;
  underlyingTokenPriceMantissa: string | null;
  yieldPlusPositionAccountAddress: Address | null;
  yieldPlusLongVTokenAddress: Address | null;
  yieldPlusShortVTokenAddress: Address | null;
  yieldPlusDsaVTokenAddress: Address | null;
  yieldPlusCycleId: string | null;
  yieldPlusEffectiveLeverageRatio: string | null;
  yieldPlusInitialPrincipalMantissa: string | null;
  yieldPlusPrincipalAmountMantissa: string | null;
  yieldPlusNewTotalPrincipalMantissa: string | null;
  yieldPlusRemainingPrincipalMantissa: string | null;
  yieldPlusShortAmountMantissa: string | null;
  yieldPlusLongAmountMantissa: string | null;
  yieldPlusAdditionalPrincipalMantissa: string | null;
  yieldPlusCloseFractionBps: string | null;
  yieldPlusAmountRepaidMantissa: string | null;
  yieldPlusAmountRedeemedMantissa: string | null;
  yieldPlusAmountRedeemedDsaMantissa: string | null;
  yieldPlusLongDustRedeemedMantissa: string | null;
  yieldPlusAmountConvertedToProfitMantissa: string | null;
  yieldPlusDsaProfitAmountMantissa: string | null;
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
  type?: TxType;
  page?: number;
}

export type GetAccountTransactionHistoryOutput = {
  count: number;
  transactions: Tx[];
};

export type VTokenAssetMapping = Record<
  Address,
  Asset & {
    poolName: string;
  }
>;
