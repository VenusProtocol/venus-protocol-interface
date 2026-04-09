import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { getFixedRatedVaults } from '.';
import type { GetFixedRatedVaultsOutput } from './types';

export type UseGetFixedRatedVaultsQueryKey = [FunctionKey.GET_FIXED_RATED_VAULTS, ChainId];

type Options = QueryObserverOptions<
  GetFixedRatedVaultsOutput,
  Error,
  GetFixedRatedVaultsOutput,
  GetFixedRatedVaultsOutput,
  UseGetFixedRatedVaultsQueryKey
>;

export const useGetFixedRatedVaults = (options?: Partial<Options>) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [FunctionKey.GET_FIXED_RATED_VAULTS, chainId],
    queryFn: () => getFixedRatedVaults({ chainId }),
    ...options,
  });
};
