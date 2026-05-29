import type { ChainId } from 'types';
import type { Address } from 'viem';
import { fetchRiskDashboard } from '../fetchRiskDashboard';

export type LiquidationsDistributionAxis = 'collateral' | 'debt';

export interface ApiRiskDashboardLiquidationsDistributionRow {
  marketAddress: Address;
  count: string;
  valueUsdCents: string;
}

export interface GetRiskDashboardLiquidationsDistributionResponse {
  chainId: string;
  days: number;
  by: LiquidationsDistributionAxis;
  rows: ApiRiskDashboardLiquidationsDistributionRow[];
}

export const getRiskDashboardLiquidationsDistribution = ({
  chainId,
  days,
  by,
}: {
  chainId: ChainId;
  days: number;
  by: LiquidationsDistributionAxis;
}) =>
  fetchRiskDashboard<GetRiskDashboardLiquidationsDistributionResponse>({
    endpoint: '/risk-dashboard/liquidations-distribution',
    chainId,
    params: { days, by },
  });
