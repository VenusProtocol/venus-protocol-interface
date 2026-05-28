import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { type GetRiskDashboardEModePoolsResponse, getRiskDashboardEModePools } from '.';

export type UseGetRiskDashboardEModePoolsQueryKey = [
  FunctionKey.GET_RISK_DASHBOARD_EMODE_POOLS,
  { chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetRiskDashboardEModePoolsResponse,
  Error,
  GetRiskDashboardEModePoolsResponse,
  GetRiskDashboardEModePoolsResponse,
  UseGetRiskDashboardEModePoolsQueryKey
>;

export const useGetRiskDashboardEModePools = (options?: Partial<Options>) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [FunctionKey.GET_RISK_DASHBOARD_EMODE_POOLS, { chainId }],
    queryFn: () => getRiskDashboardEModePools({ chainId }),
    ...options,
  });
};
