import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import {
  type GetRiskDashboardLiquidationsDailyResponse,
  getRiskDashboardLiquidationsDaily,
} from '.';

export type UseGetRiskDashboardLiquidationsDailyQueryKey = [
  FunctionKey.GET_RISK_DASHBOARD_LIQUIDATIONS_DAILY,
  { chainId: ChainId; days: number },
];

type Options = QueryObserverOptions<
  GetRiskDashboardLiquidationsDailyResponse,
  Error,
  GetRiskDashboardLiquidationsDailyResponse,
  GetRiskDashboardLiquidationsDailyResponse,
  UseGetRiskDashboardLiquidationsDailyQueryKey
>;

export const useGetRiskDashboardLiquidationsDaily = (
  { days }: { days: number },
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [
      FunctionKey.GET_RISK_DASHBOARD_LIQUIDATIONS_DAILY,
      { chainId, days },
    ],
    queryFn: () => getRiskDashboardLiquidationsDaily({ chainId, days }),
    ...options,
  });
};
