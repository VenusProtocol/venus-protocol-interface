import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import {
  type GetRiskDashboardLiquidationsDistributionResponse,
  type LiquidationsDistributionAxis,
  getRiskDashboardLiquidationsDistribution,
} from '.';

export type UseGetRiskDashboardLiquidationsDistributionQueryKey = [
  FunctionKey.GET_RISK_DASHBOARD_LIQUIDATIONS_DISTRIBUTION,
  { chainId: ChainId; days: number; by: LiquidationsDistributionAxis },
];

type Options = QueryObserverOptions<
  GetRiskDashboardLiquidationsDistributionResponse,
  Error,
  GetRiskDashboardLiquidationsDistributionResponse,
  GetRiskDashboardLiquidationsDistributionResponse,
  UseGetRiskDashboardLiquidationsDistributionQueryKey
>;

export const useGetRiskDashboardLiquidationsDistribution = (
  { days, by }: { days: number; by: LiquidationsDistributionAxis },
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [
      FunctionKey.GET_RISK_DASHBOARD_LIQUIDATIONS_DISTRIBUTION,
      { chainId, days, by },
    ],
    queryFn: () =>
      getRiskDashboardLiquidationsDistribution({ chainId, days, by }),
    ...options,
  });
};
