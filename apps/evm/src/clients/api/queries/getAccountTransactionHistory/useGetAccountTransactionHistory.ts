import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import type { Address } from 'viem';
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
      vTokenAddresses: Address[];
    },
  ]
>;

// The query is combined with the pools one below, which means knowing whether it is enabled.
// "enabled" is therefore narrowed to a boolean, since the predicate form react-query also accepts
// could not be resolved here.
type UseGetAccountTransactionHistoryOptions = Partial<Omit<Options, 'enabled'>> & {
  enabled?: boolean;
};

export const useGetAccountTransactionHistory = (
  params: TrimmedGetAccountTransactionHistoryInput,
  options?: UseGetAccountTransactionHistoryOptions,
) => {
  const { chainId } = useChainId();
  const { data: getPoolsData, isError: isGetPoolsError } = useGetPools({
    includeIsolatedPools: true,
  });

  // Transactions are formatted against the assets of the fetched pools, and any transaction
  // referencing a vToken that is missing from them is discarded. The vToken addresses are
  // therefore part of the query key, so the history is refetched whenever the pools resolve or
  // their assets change. They are lowercased to mirror the mapping the query builds out of them,
  // and sorted to output the same key when the pools are returned in a different order, which
  // prevents unnecessary queries.
  const vTokenAddresses = (getPoolsData?.pools || [])
    .flatMap(pool => pool.assets.map(asset => asset.vToken.address.toLowerCase() as Address))
    .sort();

  const isEnabled = options?.enabled === undefined || options.enabled;
  const arePoolsPending = !getPoolsData && !isGetPoolsError;

  const queryResult = useQuery({
    queryKey: [
      FunctionKey.GET_ACCOUNT_TRANSACTION_HISTORY,
      { ...params, chainId, vTokenAddresses },
    ],
    queryFn: () =>
      getAccountTransactionHistory({
        ...params,
        getPoolsData,
        liquidityHubs, // TODO: fetch from API
        chainId,
      }),
    ...options,
    // Wait for the pools to have been fetched, otherwise every transaction gets discarded
    enabled: isEnabled && !!getPoolsData,
  });

  return {
    ...queryResult,
    // Keep reporting a loading state while the pools are being fetched, otherwise consumers
    // briefly render an empty history
    isLoading: queryResult.isLoading || (isEnabled && arePoolsPending),
  };
};
