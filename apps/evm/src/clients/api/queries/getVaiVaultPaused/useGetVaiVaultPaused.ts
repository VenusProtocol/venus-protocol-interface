import { type QueryObserverOptions, useQuery } from 'react-query';

import { type GetVaiVaultPausedOutput, getVaiVaultPaused } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetVaiVaultContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

export type UseGetVaiVaultPausedQueryKey = [FunctionKey.GET_VAI_VAULT_PAUSED, { chainId: ChainId }];

type Options = QueryObserverOptions<
  GetVaiVaultPausedOutput,
  Error,
  GetVaiVaultPausedOutput,
  GetVaiVaultPausedOutput,
  UseGetVaiVaultPausedQueryKey
>;

const useGetVaiVaultPaused = (options?: Options) => {
  const { chainId } = useChainId();
  const vaiVaultContract = useGetVaiVaultContract();

  return useQuery(
    [FunctionKey.GET_VAI_VAULT_PAUSED, { chainId }],
    () => callOrThrow({ vaiVaultContract }, getVaiVaultPaused),
    {
      ...options,
      enabled: !!vaiVaultContract && (options?.enabled === undefined || options?.enabled),
    },
  );
};

export default useGetVaiVaultPaused;
