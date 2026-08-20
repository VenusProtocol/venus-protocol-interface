import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities';
import type { ApiRiskDashboardAsOf } from '../getRiskDashboardMarketAggregates';
import type { ApiRiskDashboardTopWalletPosition } from '../getRiskDashboardTopWallets';

export type RiskDashboardWalletsOrderBy =
  | 'supply'
  | 'collateral'
  | 'borrow'
  | 'healthFactor'
  | 'badDebt'
  | 'badDebtDuration';

export type RiskDashboardWalletsRiskStatus = 'at_risk' | 'eligible_for_liquidation' | 'bad_debt';

export interface ApiRiskDashboardWallet {
  address: string;
  totalSupplyUsdCents: string;
  totalCollateralUsdCents: string;
  totalBorrowUsdCents: string;
  healthFactorMantissa: string;
  badDebtUsdCents: string;
  badDebtStartedAt: string | null;
  badDebtStartedAtIsFloor: boolean;
  positions: ApiRiskDashboardTopWalletPosition[];
}

export interface GetRiskDashboardWalletsInput {
  chainId: ChainId;
  page: number;
  limit: number;
  orderBy: RiskDashboardWalletsOrderBy;
  order: 'asc' | 'desc';
  riskStatus?: RiskDashboardWalletsRiskStatus;
  minPositionUsdCents?: number;
  marketAddresses?: string[];
  suppliedMarketAddresses?: string[];
  borrowedMarketAddresses?: string[];
}

export interface GetRiskDashboardWalletsResponse {
  chainId: string;
  asOf: ApiRiskDashboardAsOf | null;
  page: number;
  limit: number;
  total: number;
  wallets: ApiRiskDashboardWallet[];
}

const serializeAddresses = (addresses?: string[]) =>
  addresses && addresses.length > 0 ? addresses.join(',') : undefined;

export async function getRiskDashboardWallets({
  chainId,
  page,
  limit,
  orderBy,
  order,
  riskStatus,
  minPositionUsdCents,
  marketAddresses,
  suppliedMarketAddresses,
  borrowedMarketAddresses,
}: GetRiskDashboardWalletsInput) {
  const response = await restService<GetRiskDashboardWalletsResponse>({
    endpoint: '/risk-dashboard/wallets',
    method: 'GET',
    params: {
      chainId,
      page,
      limit,
      orderBy,
      order,
      riskStatus,
      minPositionUsdCents,
      marketAddresses: serializeAddresses(marketAddresses),
      suppliedMarketAddresses: serializeAddresses(suppliedMarketAddresses),
      borrowedMarketAddresses: serializeAddresses(borrowedMarketAddresses),
    },
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
