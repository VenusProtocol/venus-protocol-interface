import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities';
import type { ApiRiskDashboardAsOf } from '../getRiskDashboardMarketAggregates';

export type RiskDashboardTopWalletsKind = 'suppliers' | 'borrowers';

export interface ApiRiskDashboardTopWalletPosition {
  marketAddress: string;
  supplyUsdCents: string;
  borrowUsdCents: string;
  isCollateral: boolean;
}

export interface ApiRiskDashboardTopWallet {
  address: string;
  totalSupplyUsdCents: string;
  totalBorrowUsdCents: string;
  healthFactorMantissa: string;
  positions: ApiRiskDashboardTopWalletPosition[];
}

export interface GetRiskDashboardTopWalletsInput {
  chainId: ChainId;
  kind: RiskDashboardTopWalletsKind;
  limit?: number;
}

export interface GetRiskDashboardTopWalletsResponse {
  chainId: string;
  kind: RiskDashboardTopWalletsKind;
  asOf: ApiRiskDashboardAsOf | null;
  wallets: ApiRiskDashboardTopWallet[];
}

export async function getRiskDashboardTopWallets({
  chainId,
  kind,
  limit,
}: GetRiskDashboardTopWalletsInput) {
  const response = await restService<GetRiskDashboardTopWalletsResponse>({
    endpoint: '/risk-dashboard/top-wallets',
    method: 'GET',
    params: { chainId, kind, limit },
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
