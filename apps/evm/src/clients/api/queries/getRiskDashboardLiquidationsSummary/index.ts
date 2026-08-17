import type { ChainId } from 'types';
import { fetchRiskDashboard } from '../fetchRiskDashboard';

export interface GetRiskDashboardLiquidationsSummaryResponse {
  chainId: string;
  days: number;
  count: string;
  debtRepaidUsdCents: string;
  collateralSeizedUsdCents: string;
  bonusUsdCents: string;
  activeLiquidators: string;
  uniqueBorrowers: string;
}

export const getRiskDashboardLiquidationsSummary = ({
  chainId,
  days,
}: {
  chainId: ChainId;
  days: number;
}) =>
  fetchRiskDashboard<GetRiskDashboardLiquidationsSummaryResponse>({
    endpoint: '/risk-dashboard/liquidations-summary',
    chainId,
    params: { days },
  });
