import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import {
  type GetAccountNetWorthHistoryInput,
  type GetAccountNetWorthHistoryOutput,
  getAccountNetWorthHistory,
} from '.';

type Options = QueryObserverOptions<
  GetAccountNetWorthHistoryOutput,
  Error,
  GetAccountNetWorthHistoryOutput,
  GetAccountNetWorthHistoryOutput,
  [FunctionKey.GET_ACCOUNT_NETWORTH_HISTORY, GetAccountNetWorthHistoryInput]
>;

type TrimmedGetAccountNetWorthHistoryInput = Omit<GetAccountNetWorthHistoryInput, 'chainId'>;

export const useGetAccountNetWorthHistory = (
  params: TrimmedGetAccountNetWorthHistoryInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const extendedParams = {
    ...params,
    chainId,
  };

  return useQuery({
    queryKey: [FunctionKey.GET_ACCOUNT_NETWORTH_HISTORY, extendedParams],
    queryFn: () => getAccountNetWorthHistory(extendedParams),
    ...options,
  });
};
