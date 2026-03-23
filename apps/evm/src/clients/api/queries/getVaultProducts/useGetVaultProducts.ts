import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { getVaultProducts } from '.';
import type { GetVaultProductsOutput } from './types';

export type UseGetVaultProductsQueryKey = [FunctionKey.GET_VAULT_PRODUCTS, ChainId];

type Options = QueryObserverOptions<
  GetVaultProductsOutput,
  Error,
  GetVaultProductsOutput,
  GetVaultProductsOutput,
  UseGetVaultProductsQueryKey
>;

export const useGetVaultProducts = (options?: Partial<Options>) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [FunctionKey.GET_VAULT_PRODUCTS, chainId],
    queryFn: () => getVaultProducts({ chainId }),
    ...options,
    enabled: options?.enabled === undefined || options?.enabled,
  });
};
