import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import {
  type GetAccountPerformanceHistoryInput,
  type GetAccountPerformanceHistoryOutput,
  getAccountPerformanceHistory,
} from '.';

type Options = QueryObserverOptions<
  GetAccountPerformanceHistoryOutput,
  Error,
  GetAccountPerformanceHistoryOutput,
  GetAccountPerformanceHistoryOutput,
  [FunctionKey.GET_ACCOUNT_PERFORMANCE_HISTORY, GetAccountPerformanceHistoryInput]
>;

type TrimmedGetAccountPerformanceHistoryInput = Omit<GetAccountPerformanceHistoryInput, 'chainId'>;

export const useGetAccountPerformanceHistory = (
  params: TrimmedGetAccountPerformanceHistoryInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const extendedParams = {
    ...params,
    chainId,
  };

  return useQuery({
    queryKey: [FunctionKey.GET_ACCOUNT_PERFORMANCE_HISTORY, extendedParams],
    queryFn: () => getAccountPerformanceHistory(extendedParams),
    ...options,
  });
};
