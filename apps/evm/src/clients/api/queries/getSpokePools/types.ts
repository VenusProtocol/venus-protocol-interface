import type { Address } from 'viem';

export type ApiSpokeMarketSide = 'liquidity' | 'collateral';

export interface ApiSpokeMarket {
  address: Address;
  symbol: string | null;
  name: string | null;
  underlyingAddress: Address | null;
  vTokenDecimals: number;
  isListed: boolean;
  side: ApiSpokeMarketSide | null;
  suppliable: boolean;
  hubSupplied: string | null;
  supplyAllowlistEnabled: boolean;
  underlyingPriceMantissa: string;
  exchangeRateMantissa: string;
  totalSupplyMantissa: string;
  totalBorrowsMantissa: string;
  totalReservesMantissa: string;
  cashMantissa: string;
  totalSupplyUsdCents: string;
  totalBorrowsUsdCents: string;
  supplyRatePerBlockMantissa: string;
  borrowRatePerBlockMantissa: string;
  supplyApyDecimal: number;
  borrowApyDecimal: number;
  collateralFactorMantissa: string;
  reserveFactorMantissa: string;
  liquidationThresholdMantissa: string;
  liquidationIncentiveMantissa: string;
  supplyCapsMantissa: string;
  borrowCapsMantissa: string;
  pausedActionsBitmap: number;
}

export interface ApiSpokePool {
  address: Address;
  chainId: string;
  name: string | null;
  description: string | null;
  category: string | null;
  markets: ApiSpokeMarket[];
}

export interface GetSpokePoolsResponse {
  result?: ApiSpokePool[];
}

export interface ApiSpokePosition {
  marketAddress: Address;
  vTokenBalanceMantissa: string;
  borrowBalanceMantissa: string;
  underlyingBalanceMantissa: string;
  isCollateral: boolean;
  supplyUsdCents: string;
  borrowUsdCents: string;
}

export interface ApiSpokeAccountPool {
  comptrollerAddress: Address;
  healthFactorMantissa: string;
  totalSupplyUsdCents: string;
  totalBorrowUsdCents: string;
  totalCollateralUsdCents: string;
  liquidityUsdCents: string;
  shortfallUsdCents: string;
  badDebtUsdCents: string;
  positions: ApiSpokePosition[];
}

export interface GetSpokePositionsResponse {
  result?: ApiSpokeAccountPool[];
}
