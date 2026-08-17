import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { type GetRiskDashboardMarketsResponse, getRiskDashboardMarkets } from '.';

export type UseGetRiskDashboardMarketsQueryKey = [
  FunctionKey.GET_RISK_DASHBOARD_MARKETS,
  { chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetRiskDashboardMarketsResponse,
  Error,
  GetRiskDashboardMarketsResponse,
  GetRiskDashboardMarketsResponse,
  UseGetRiskDashboardMarketsQueryKey
>;

export const useGetRiskDashboardMarkets = (options?: Partial<Options>) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [FunctionKey.GET_RISK_DASHBOARD_MARKETS, { chainId }],
    queryFn: () => getRiskDashboardMarkets({ chainId }),
    ...options,
  });
};
