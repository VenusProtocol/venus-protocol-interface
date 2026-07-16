import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { type GetRiskDashboardRatesHistoryResponse, getRiskDashboardRatesHistory } from '.';

export type UseGetRiskDashboardRatesHistoryQueryKey = [
  FunctionKey.GET_RISK_DASHBOARD_RATES_HISTORY,
  { chainId: ChainId; topTokens?: boolean },
];

type Options = QueryObserverOptions<
  GetRiskDashboardRatesHistoryResponse,
  Error,
  GetRiskDashboardRatesHistoryResponse,
  GetRiskDashboardRatesHistoryResponse,
  UseGetRiskDashboardRatesHistoryQueryKey
>;

export const useGetRiskDashboardRatesHistory = (
  { topTokens }: { topTokens?: boolean } = {},
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [FunctionKey.GET_RISK_DASHBOARD_RATES_HISTORY, { chainId, topTokens }],
    queryFn: () => getRiskDashboardRatesHistory({ chainId, topTokens }),
    ...options,
  });
};
