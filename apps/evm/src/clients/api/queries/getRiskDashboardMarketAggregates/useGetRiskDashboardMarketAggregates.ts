import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { type GetRiskDashboardMarketAggregatesResponse, getRiskDashboardMarketAggregates } from '.';

export type UseGetRiskDashboardMarketAggregatesQueryKey = [
  FunctionKey.GET_RISK_DASHBOARD_MARKET_AGGREGATES,
  { chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetRiskDashboardMarketAggregatesResponse,
  Error,
  GetRiskDashboardMarketAggregatesResponse,
  GetRiskDashboardMarketAggregatesResponse,
  UseGetRiskDashboardMarketAggregatesQueryKey
>;

export const useGetRiskDashboardMarketAggregates = (options?: Partial<Options>) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [FunctionKey.GET_RISK_DASHBOARD_MARKET_AGGREGATES, { chainId }],
    queryFn: () => getRiskDashboardMarketAggregates({ chainId }),
    ...options,
  });
};
