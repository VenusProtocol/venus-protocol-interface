import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import { type GetXvsVaultPausedOutput, getXvsVaultPaused } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetXvsVaultContractAddress } from 'libs/contracts';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

export type UseGetXvsVaultPausedQueryKey = [FunctionKey.GET_XVS_VAULT_PAUSED, { chainId: ChainId }];

type Options = QueryObserverOptions<
  GetXvsVaultPausedOutput,
  Error,
  GetXvsVaultPausedOutput,
  GetXvsVaultPausedOutput,
  UseGetXvsVaultPausedQueryKey
>;

export const useGetXvsVaultPaused = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const xvsVaultContractAddress = useGetXvsVaultContractAddress();

  return useQuery({
    queryKey: [FunctionKey.GET_XVS_VAULT_PAUSED, { chainId }],
    queryFn: () =>
      callOrThrow({ xvsVaultContractAddress }, params =>
        getXvsVaultPaused({
          ...params,
          publicClient,
        }),
      ),
    ...options,
    enabled: !!xvsVaultContractAddress && (options?.enabled === undefined || options?.enabled),
  });
};

export default useGetXvsVaultPaused;
