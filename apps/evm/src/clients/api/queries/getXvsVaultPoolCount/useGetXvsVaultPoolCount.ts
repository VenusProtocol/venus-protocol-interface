import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import {
  type GetXvsVaultPoolCountOutput,
  getXvsVaultPoolCount,
} from 'clients/api/queries/getXvsVaultPoolCount';
import FunctionKey from 'constants/functionKey';
import { useGetXvsVaultContractAddress } from 'libs/contracts';
import { useGetToken } from 'libs/tokens';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

export type UseGetXvsVaultPoolCountQueryKey = [
  FunctionKey.GET_XVS_VAULT_POOLS_COUNT,
  { chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetXvsVaultPoolCountOutput,
  Error,
  GetXvsVaultPoolCountOutput,
  GetXvsVaultPoolCountOutput,
  UseGetXvsVaultPoolCountQueryKey
>;

export const useGetXvsVaultPoolCount = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const xvsVaultContractAddress = useGetXvsVaultContractAddress();

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  return useQuery({
    queryKey: [FunctionKey.GET_XVS_VAULT_POOLS_COUNT, { chainId }],
    queryFn: () =>
      callOrThrow({ xvsVaultContractAddress, xvsTokenAddress: xvs?.address }, params =>
        getXvsVaultPoolCount({
          ...params,
          publicClient,
        }),
      ),
    ...options,
  });
};
