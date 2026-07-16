import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities';
import type { Address } from 'viem';
import type { RiskDashboardMarketSnapshotKind } from '../getRiskDashboardMarketSnapshots';

export interface ApiRiskDashboardStablecoinRatesAssetPoint {
  marketAddress: Address;
  underlyingAddress: Address;
  supplyUsdCents: string;
  borrowsUsdCents: string;
  supplyShare: number;
  borrowShare: number;
}

export interface ApiRiskDashboardStablecoinRatesSlot {
  blockNumber: string;
  blockTimestamp: string;
  supplyRatePerBlockMantissa: string;
  borrowRatePerBlockMantissa: string;
  supplyApy: number;
  borrowApy: number;
  totalSupplyUsdCents: string;
  totalBorrowsUsdCents: string;
  byAsset: ApiRiskDashboardStablecoinRatesAssetPoint[];
}

export interface GetRiskDashboardStablecoinRatesInput {
  chainId: ChainId;
}

export interface GetRiskDashboardStablecoinRatesResponse {
  chainId: string;
  kind: RiskDashboardMarketSnapshotKind;
  series: ApiRiskDashboardStablecoinRatesSlot[];
}

export async function getRiskDashboardStablecoinRates({
  chainId,
}: GetRiskDashboardStablecoinRatesInput) {
  const response = await restService<GetRiskDashboardStablecoinRatesResponse>({
    endpoint: '/risk-dashboard/stablecoin-rates',
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
