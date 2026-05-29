import type { ChainId } from 'types';
import { fetchRiskDashboard } from '../fetchRiskDashboard';

export interface ApiRiskDashboardLiquidationsDailyDay {
  day: string;
  count: string;
  debtRepaidUsdCents: string;
  collateralSeizedUsdCents: string;
  activeLiquidators: string;
}

export interface GetRiskDashboardLiquidationsDailyResponse {
  chainId: string;
  days: number;
  series: ApiRiskDashboardLiquidationsDailyDay[];
}

export const getRiskDashboardLiquidationsDaily = ({
  chainId,
  days,
}: {
  chainId: ChainId;
  days: number;
}) =>
  fetchRiskDashboard<GetRiskDashboardLiquidationsDailyResponse>({
    endpoint: '/risk-dashboard/liquidations-daily',
    chainId,
    params: { days },
  });
