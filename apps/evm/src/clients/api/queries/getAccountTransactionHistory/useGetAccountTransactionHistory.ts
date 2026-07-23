import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import {
  type GetAccountTransactionHistoryInput,
  type GetAccountTransactionHistoryOutput,
  getAccountTransactionHistory,
} from '.';
import { useGetPools } from '../useGetPools';

type TrimmedGetAccountTransactionHistoryInput = Omit<
  GetAccountTransactionHistoryInput,
  'chainId' | 'getPoolsData' | 'liquidityHubs'
>;

type Options = QueryObserverOptions<
  GetAccountTransactionHistoryOutput,
  Error,
  GetAccountTransactionHistoryOutput,
  GetAccountTransactionHistoryOutput,
  [
    FunctionKey.GET_ACCOUNT_TRANSACTION_HISTORY,
    TrimmedGetAccountTransactionHistoryInput & {
      chainId: ChainId;
    },
  ]
>;

export const useGetAccountTransactionHistory = (
  params: TrimmedGetAccountTransactionHistoryInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { data: getPoolsData } = useGetPools();
  const extendedParams = {
    ...params,
    getPoolsData,
    liquidityHubs, // TODO: fetch from API
    chainId,
  };

  return useQuery({
    queryKey: [FunctionKey.GET_ACCOUNT_TRANSACTION_HISTORY, { ...params, chainId }],
    queryFn: () => getAccountTransactionHistory(extendedParams),
    ...options,
  });
};
