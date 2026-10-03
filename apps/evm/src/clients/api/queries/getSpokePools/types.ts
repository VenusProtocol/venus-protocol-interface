import type BigNumber from 'bignumber.js';
import type { Address } from 'viem';

export type ApiSpokeMarketSide = 'liquidity' | 'collateral' | 'inactive';

export interface ApiSpokeMarket {
  address: Address;
  symbol: string | null;
  name: string | null;
  underlyingAddress: Address | null;
  vTokenDecimals: number;
  isListed: boolean;
  side: ApiSpokeMarketSide;
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
  supplierCount?: number;
  borrowerCount?: number;
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

export interface ApiSpokeTotals {
  poolCount: number;
  totalBorrowsUsdCents: string;
  availableLiquidityUsdCents: string;
}

export interface GetSpokePoolsResponse {
  result?: ApiSpokePool[];
  totals: ApiSpokeTotals;
}

export interface SpokeUserPosition {
  vTokenAddress: Address;
  supplyBalanceMantissa: BigNumber;
  borrowBalanceMantissa: BigNumber;
  isCollateral: boolean;
}
