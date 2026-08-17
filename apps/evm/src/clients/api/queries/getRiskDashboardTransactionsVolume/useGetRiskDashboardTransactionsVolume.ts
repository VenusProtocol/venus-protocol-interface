import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import {
  type GetRiskDashboardTransactionsVolumeResponse,
  getRiskDashboardTransactionsVolume,
} from '.';

export interface UseGetRiskDashboardTransactionsVolumeInput {
  days?: number;
}

export type UseGetRiskDashboardTransactionsVolumeQueryKey = [
  FunctionKey.GET_RISK_DASHBOARD_TRANSACTIONS_VOLUME,
  { chainId: ChainId; days?: number },
];

type Options = QueryObserverOptions<
  GetRiskDashboardTransactionsVolumeResponse,
  Error,
  GetRiskDashboardTransactionsVolumeResponse,
  GetRiskDashboardTransactionsVolumeResponse,
  UseGetRiskDashboardTransactionsVolumeQueryKey
>;

export const useGetRiskDashboardTransactionsVolume = (
  { days }: UseGetRiskDashboardTransactionsVolumeInput = {},
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [FunctionKey.GET_RISK_DASHBOARD_TRANSACTIONS_VOLUME, { chainId, days }],
    queryFn: () => getRiskDashboardTransactionsVolume({ chainId, days }),
    ...options,
  });
};
