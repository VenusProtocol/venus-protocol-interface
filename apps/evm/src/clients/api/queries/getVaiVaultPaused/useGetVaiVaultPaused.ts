import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { getVaiVaultContractAddress } from 'libs/contracts';
import { usePublicClient } from 'libs/wallet';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import { type GetVaiVaultPausedOutput, getVaiVaultPaused } from '.';

export type UseGetVaiVaultPausedQueryKey = [FunctionKey.GET_VAI_VAULT_PAUSED, { chainId: ChainId }];

type Options = QueryObserverOptions<
  GetVaiVaultPausedOutput,
  Error,
  GetVaiVaultPausedOutput,
  GetVaiVaultPausedOutput,
  UseGetVaiVaultPausedQueryKey
>;

export const useGetVaiVaultPaused = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const vaiVaultAddress = getVaiVaultContractAddress({
    chainId,
  });

  return useQuery({
    queryKey: [FunctionKey.GET_VAI_VAULT_PAUSED, { chainId }],
    queryFn: () =>
      callOrThrow({ vaiVaultAddress }, params => getVaiVaultPaused({ ...params, publicClient })),
    ...options,
    enabled: !!vaiVaultAddress && (options?.enabled === undefined || options?.enabled),
  });
};
