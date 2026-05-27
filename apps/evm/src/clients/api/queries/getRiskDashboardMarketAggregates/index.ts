import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities';

export interface ApiRiskDashboardAsOf {
  blockNumber: string;
  blockTimestamp: string;
}

export interface GetRiskDashboardMarketAggregatesInput {
  chainId: ChainId;
}

export interface GetRiskDashboardMarketAggregatesResponse {
  chainId: string;
  asOf: ApiRiskDashboardAsOf;
  totalSupplyUsdCents: string;
  totalBorrowsUsdCents: string;
  liquidityUsdCents: string;
  utilization: number;
}

export async function getRiskDashboardMarketAggregates({
  chainId,
}: GetRiskDashboardMarketAggregatesInput) {
  const response = await restService<GetRiskDashboardMarketAggregatesResponse>({
    endpoint: '/risk-dashboard/market-aggregates',
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
