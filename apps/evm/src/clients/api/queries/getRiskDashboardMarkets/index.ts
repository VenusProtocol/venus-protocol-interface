import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities';
import type { Address } from 'viem';
import type { ApiRiskDashboardAsOf } from '../getRiskDashboardMarketAggregates';

export interface ApiRiskDashboardMarket {
  marketAddress: Address;
  underlyingAddress: Address | null;
  vTokenDecimals: number;
  totalSupplyUsdCents: string;
  totalBorrowsUsdCents: string;
  liquidityUsdCents: string;
  supplyCapUsdCents: string | null;
  borrowCapUsdCents: string | null;
  priceMantissa: string;
  supplyRatePerBlockMantissa: string;
  borrowRatePerBlockMantissa: string;
  collateralFactorMantissa: string;
  reserveFactorMantissa: string;
  liquidationThresholdMantissa: string;
  liquidationIncentiveMantissa: string;
  topSupplierUsdCents: string | null;
  topBorrowerUsdCents: string | null;
  totalDebtAgainstUsdCents: string | null;
  stablecoinDebtUsdCents: string | null;
  bnbDebtUsdCents: string | null;
  otherDebtUsdCents: string | null;
}

export interface GetRiskDashboardMarketsInput {
  chainId: ChainId;
}

export interface GetRiskDashboardMarketsResponse {
  chainId: string;
  asOf: ApiRiskDashboardAsOf | null;
  markets: ApiRiskDashboardMarket[];
}

export async function getRiskDashboardMarkets({ chainId }: GetRiskDashboardMarketsInput) {
  const response = await restService<GetRiskDashboardMarketsResponse>({
    endpoint: '/risk-dashboard/markets',
    method: 'GET',
    params: { chainId },
  });

  const payload = response.data;

  if (payload && 'error' in payload) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: payload.error },
    });
  }

  if (!payload) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  return payload;
}
