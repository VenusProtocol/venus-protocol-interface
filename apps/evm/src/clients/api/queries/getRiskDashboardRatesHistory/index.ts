import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities';
import type { Address } from 'viem';
import type { RiskDashboardMarketSnapshotKind } from '../getRiskDashboardMarketSnapshots';

export interface ApiRiskDashboardRatesHistoryMarketPoint {
  marketAddress: Address;
  underlyingAddress: Address | null;
  supplyRatePerBlockMantissa: string;
  borrowRatePerBlockMantissa: string;
  supplyApy: number;
  borrowApy: number;
  supplyUsdCents: string;
  borrowsUsdCents: string;
}

export interface ApiRiskDashboardRatesHistorySlot {
  blockNumber: string;
  blockTimestamp: string;
  byMarket: ApiRiskDashboardRatesHistoryMarketPoint[];
}

export interface GetRiskDashboardRatesHistoryInput {
  chainId: ChainId;
  topTokens?: boolean;
}

export interface GetRiskDashboardRatesHistoryResponse {
  chainId: string;
  kind: RiskDashboardMarketSnapshotKind;
  series: ApiRiskDashboardRatesHistorySlot[];
}

export async function getRiskDashboardRatesHistory({
  chainId,
  topTokens,
}: GetRiskDashboardRatesHistoryInput) {
  const response = await restService<GetRiskDashboardRatesHistoryResponse>({
    endpoint: '/risk-dashboard/rates-history',
    method: 'GET',
    params: { chainId, ...(topTokens ? { topTokens: true } : {}) },
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
