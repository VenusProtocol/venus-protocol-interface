import type { Address } from 'viem';

export interface ApiSmartDcaToken {
  address: Address;
  symbol: string;
  decimals: number;
}

export type ApiSmartDcaPairPeriod = 'open' | 'locked' | 'executing';

export interface ApiSmartDcaPair {
  pairId: number;
  isEnabled: boolean;
  stableToken: ApiSmartDcaToken;
  assetToken: ApiSmartDcaToken;
  stablePriceUsdMantissa: string | null;
  assetPriceUsdMantissa: string | null;
  stableApyRatio: string | null;
  assetApyRatio: string | null;
  minAmountPerBuyMantissa: string;
  period: ApiSmartDcaPairPeriod;
  currentRound: number;
  nextBuyTimestamp: number | null;
  newPlanFirstBuyTimestamp: number | null;
  userActivePlanCount?: number;
}

export interface ApiSmartDcaConfig {
  isPaused: boolean;
  feeRateRatio: string;
  maxSlippageRatio: string;
  minBuys: number;
  maxBuys: number;
}

export interface GetSmartDcaPairsResponse {
  chainId: number;
  config: ApiSmartDcaConfig;
  result: ApiSmartDcaPair[];
}

export type ApiSmartDcaPlanStatus = 'active' | 'matured';

export interface ApiSmartDcaPlanEarned {
  assetMantissa: string | null;
  assetUsdMantissa: string | null;
  stableMantissa: string;
  stableUsdMantissa: string | null;
  totalUsdMantissa: string | null;
}

export interface ApiSmartDcaPlan {
  planId: string;
  pairId: number;
  status: ApiSmartDcaPlanStatus;
  isInCurrentRound: boolean;
  isBuying: boolean;
  totalBuys: number;
  completedBuys: number;
  buysLeft: number;
  depositedMantissa: string;
  depositedUsdMantissa: string | null;
  waitingMantissa: string;
  waitingUsdMantissa: string | null;
  nextBuyTimestamp: number | null;
  nextBuyMantissa: string;
  nextBuyUsdMantissa: string | null;
  boughtMantissa: string;
  boughtUsdMantissa: string | null;
  withdrawnMantissa: string | null;
  avgCostUsdMantissa: string | null;
  earned: ApiSmartDcaPlanEarned;
  pnlUsdMantissa: string | null;
  totalSpentMantissa: string;
  totalBoughtAtBuyMantissa: string;
  lastBuyTimestamp: number | null;
}

export interface ApiSmartDcaPlanTotals {
  depositedUsdMantissa: string | null;
  holdingsUsdMantissa: string | null;
  holdingsApyRatio: string | null;
  holdingsEarnedUsdMantissa: string | null;
  waitingUsdMantissa: string | null;
  waitingApyRatio: string | null;
  waitingEarnedUsdMantissa: string | null;
  earnedUsdMantissa: string | null;
  pnlUsdMantissa: string | null;
  pnlRatio: string | null;
  nextBuyTimestamp: number | null;
  nextBuyTotalUsdMantissa: string | null;
}

export interface GetSmartDcaAccountPlansResponse {
  chainId: number;
  totals: ApiSmartDcaPlanTotals;
  result: ApiSmartDcaPlan[];
}

export interface ApiSmartDcaBuyDone {
  buyIndex: number;
  round: number;
  timestamp: number;
  status: 'done';
  spentMantissa: string;
  feeMantissa: string;
  boughtMantissa: string;
  priceMantissa: string | null;
  txHash: string | null;
}

export interface ApiSmartDcaBuyPending {
  buyIndex: number;
  round: number;
  timestamp: number;
  status: 'buying' | 'next' | 'scheduled';
}

export type ApiSmartDcaBuy = ApiSmartDcaBuyDone | ApiSmartDcaBuyPending;

export interface GetSmartDcaAccountPlanResponse extends ApiSmartDcaPlan {
  chainId: number;
  buys: ApiSmartDcaBuy[];
}

export interface ApiSmartDcaTransactionFields {
  smartDcaPlanId: string | null;
  smartDcaPairId: number | null;
  smartDcaToCore: boolean | null;
  smartDcaStableAddress: Address | null;
  smartDcaStableAmountMantissa: string | null;
  smartDcaAssetAddress: Address | null;
  smartDcaAssetAmountMantissa: string | null;
  smartDcaStableTokenPriceMantissa: string | null;
  smartDcaAssetTokenPriceMantissa: string | null;
  smartDcaPlanDepositedMantissa: string | null;
  smartDcaTotalBuys: number | null;
  smartDcaCompletedBuys: number | null;
}
