import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import {
  type GetRiskDashboardLiquidationsSummaryResponse,
  getRiskDashboardLiquidationsSummary,
} from '.';

export type UseGetRiskDashboardLiquidationsSummaryQueryKey = [
  FunctionKey.GET_RISK_DASHBOARD_LIQUIDATIONS_SUMMARY,
  { chainId: ChainId; days: number },
];

type Options = QueryObserverOptions<
  GetRiskDashboardLiquidationsSummaryResponse,
  Error,
  GetRiskDashboardLiquidationsSummaryResponse,
  GetRiskDashboardLiquidationsSummaryResponse,
  UseGetRiskDashboardLiquidationsSummaryQueryKey
>;

export const useGetRiskDashboardLiquidationsSummary = (
  { days }: { days: number },
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [
      FunctionKey.GET_RISK_DASHBOARD_LIQUIDATIONS_SUMMARY,
      { chainId, days },
    ],
    queryFn: () => getRiskDashboardLiquidationsSummary({ chainId, days }),
    ...options,
  });
};
