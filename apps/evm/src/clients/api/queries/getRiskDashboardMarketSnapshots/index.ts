import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities';

export type RiskDashboardMarketSnapshotKind = 'day' | 'week' | 'month' | 'year';

export interface ApiRiskDashboardMarketSnapshotPoint {
  marketAddress: string;
  supplyUsdCents: string;
  borrowsUsdCents: string;
}

export interface ApiRiskDashboardMarketSnapshotSlot {
  blockNumber: string;
  blockTimestamp: string;
  totalSupplyUsdCents: string;
  totalBorrowsUsdCents: string;
  byMarket: ApiRiskDashboardMarketSnapshotPoint[];
}

export interface GetRiskDashboardMarketSnapshotsInput {
  chainId: ChainId;
  kind: RiskDashboardMarketSnapshotKind;
}

export interface GetRiskDashboardMarketSnapshotsResponse {
  chainId: string;
  kind: RiskDashboardMarketSnapshotKind;
  series: ApiRiskDashboardMarketSnapshotSlot[];
}

export async function getRiskDashboardMarketSnapshots({
  chainId,
  kind,
}: GetRiskDashboardMarketSnapshotsInput) {
  const response = await restService<GetRiskDashboardMarketSnapshotsResponse>({
    endpoint: '/risk-dashboard/market-snapshots',
    method: 'GET',
    params: { chainId, kind },
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
