import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { type GetRiskDashboardWalletAggregatesResponse, getRiskDashboardWalletAggregates } from '.';

export type UseGetRiskDashboardWalletAggregatesQueryKey = [
  FunctionKey.GET_RISK_DASHBOARD_WALLET_AGGREGATES,
  { chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetRiskDashboardWalletAggregatesResponse,
  Error,
  GetRiskDashboardWalletAggregatesResponse,
  GetRiskDashboardWalletAggregatesResponse,
  UseGetRiskDashboardWalletAggregatesQueryKey
>;

export const useGetRiskDashboardWalletAggregates = (options?: Partial<Options>) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [FunctionKey.GET_RISK_DASHBOARD_WALLET_AGGREGATES, { chainId }],
    queryFn: () => getRiskDashboardWalletAggregates({ chainId }),
    ...options,
  });
};
