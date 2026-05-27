import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities';

export interface ApiRiskDashboardTransactionsVolumeMarketBreakdown {
  marketAddress: string;
  mintUsdCents: string;
  redeemUsdCents: string;
  borrowUsdCents: string;
  repayUsdCents: string;
  liquidateUsdCents: string;
  totalUsdCents: string;
}

export interface ApiRiskDashboardTransactionsVolumeDay {
  day: string;
  mintUsdCents: string;
  redeemUsdCents: string;
  borrowUsdCents: string;
  repayUsdCents: string;
  liquidateUsdCents: string;
  totalUsdCents: string;
  byMarket: ApiRiskDashboardTransactionsVolumeMarketBreakdown[];
}

export interface GetRiskDashboardTransactionsVolumeInput {
  chainId: ChainId;
  days?: number;
}

export interface GetRiskDashboardTransactionsVolumeResponse {
  chainId: string;
  days: number;
  totalUsdCents: string;
  series: ApiRiskDashboardTransactionsVolumeDay[];
}

export async function getRiskDashboardTransactionsVolume({
  chainId,
  days,
}: GetRiskDashboardTransactionsVolumeInput) {
  const response = await restService<GetRiskDashboardTransactionsVolumeResponse>({
    endpoint: '/risk-dashboard/transactions-volume',
    method: 'GET',
    params: { chainId, days },
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
