import type { ChainId, Token, YieldPlusPosition } from 'types';
import type { Address, PublicClient } from 'viem';

interface CloseEventPnL {
  txHash: string;
  blockNumber: string;
  cycleId: string;
  closeFractionBps: string;
  amountRepaidMantissa: string;
  amountRedeemedMantissa: string;
  amountRedeemedDsaMantissa: string;
  longPriceMantissa: string;
  shortPriceMantissa: string;
  dsaPriceMantissa: string;
  pnlDsaMantissa: string;
  pnlShortAssetMantissa: string;
  pnlUsd: string;
}

interface ApiPositionPnL {
  realizedPnlShortAssetMantissa: string;
  realizedPnlUsd: string;
  unrealizedPnlShortAssetMantissa: string;
  unrealizedPnlUsd: string;
  unrealizedPnlRatio: string;
  entryRatio: string;
  currentRatio: string;
  closeEventsWithPnlData: CloseEventPnL[];
  totalShortOpenedMantissa: string;
  totalLongReceivedMantissa: string;
}

export interface ApiYieldPlusPosition {
  pnl: ApiPositionPnL | null;
  positionAccountAddress: Address;
  accountAddress: Address;
  longVTokenAddress: Address;
  shortVTokenAddress: Address;
  chainId: string;
  isActive: boolean;
  cycleId: string;
  dsaVTokenAddress: Address;
  effectiveLeverageRatio: string | null;
  capitalUtilization: {
    suppliedPrincipalMantissa: string | null;
    capitalUtilizedMantissa: string | null;
    withdrawableCapitalMantissa: string | null;
  };
}

export type GetApiYieldPlusPositionsOutput = {
  count: number;
  positions: ApiYieldPlusPosition[];
};

export interface GetRawYieldPlusPositionsInput {
  publicClient: PublicClient;
  accountAddress: Address;
  chainId: ChainId;
  tokens: Token[];
  legacyPoolComptrollerContractAddress: Address;
  venusLensContractAddress: Address;
}

export type GetRawYieldPlusPositionsOutput = {
  positions: YieldPlusPosition[];
};
