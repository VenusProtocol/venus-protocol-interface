import { VError } from 'libs/errors';
import type { ChainId } from 'types';
import { restService } from 'utilities';
import type { ApiRiskDashboardAsOf } from '../getRiskDashboardMarketAggregates';

export interface GetRiskDashboardWalletAggregatesInput {
  chainId: ChainId;
}

export interface GetRiskDashboardWalletAggregatesResponse {
  chainId: string;
  asOf: ApiRiskDashboardAsOf;
  totalSuppliers: string;
  suppliersWithPositionAboveMinUsdValue: string;
  totalBorrowers: string;
  borrowersWithPositionAboveMinUsdValue: string;
  walletsAtRisk: string;
  walletsEligibleForLiquidation: string;
  valueEligibleForLiquidationUsdCents: string;
  totalCollateralAtRiskUsdCents: string;
  totalBadDebtUsdCents: string;
}

const HEALTH_FACTOR_AT_RISK_DECIMAL = 1.125;

export async function getRiskDashboardWalletAggregates({
  chainId,
}: GetRiskDashboardWalletAggregatesInput) {
  const response = await restService<GetRiskDashboardWalletAggregatesResponse>({
    endpoint: '/risk-dashboard/wallet-aggregates',
    method: 'GET',
    params: {
      chainId,
      healthFactorAtRiskDecimal: HEALTH_FACTOR_AT_RISK_DECIMAL,
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
