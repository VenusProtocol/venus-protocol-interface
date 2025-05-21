import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import {
  type GetXvsVaultPoolInfoInput,
  type GetXvsVaultPoolInfoOutput,
  getXvsVaultPoolInfo,
} from 'clients/api/queries/getXvsVaultPoolInfo';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedGetXvsVaultPoolInfoInput = Omit<
  GetXvsVaultPoolInfoInput,
  'xvsVaultContractAddress' | 'publicClient'
>;

export type UseGetXvsVaultPoolInfoQueryKey = [
  FunctionKey.GET_XVS_VAULT_POOL_INFOS,
  TrimmedGetXvsVaultPoolInfoInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetXvsVaultPoolInfoOutput,
  Error,
  GetXvsVaultPoolInfoOutput,
  GetXvsVaultPoolInfoOutput,
  UseGetXvsVaultPoolInfoQueryKey
>;

export const useGetXvsVaultPoolInfo = (
  input: TrimmedGetXvsVaultPoolInfoInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const { address: xvsVaultContractAddress } = useGetContractAddress({
    name: 'XvsVault',
  });

  return useQuery({
    queryKey: [FunctionKey.GET_XVS_VAULT_POOL_INFOS, { ...input, chainId }],
    queryFn: () =>
      callOrThrow({ xvsVaultContractAddress }, params =>
        getXvsVaultPoolInfo({
          ...params,
          ...input,
          publicClient,
        }),
      ),
    ...options,
  });
};
