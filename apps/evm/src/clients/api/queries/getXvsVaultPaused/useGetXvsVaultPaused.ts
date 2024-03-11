import { type QueryObserverOptions, useQuery } from 'react-query';

import { type GetXvsVaultPausedOutput, getXvsVaultPaused } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetXvsVaultContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
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

const useGetXvsVaultPaused = (options?: Options) => {
  const { chainId } = useChainId();
  const xvsVaultContract = useGetXvsVaultContract();

  return useQuery(
    [FunctionKey.GET_XVS_VAULT_PAUSED, { chainId }],
    () => callOrThrow({ xvsVaultContract }, getXvsVaultPaused),
    {
      ...options,
      enabled: !!xvsVaultContract && (options?.enabled === undefined || options?.enabled),
    },
  );
};

export default useGetXvsVaultPaused;
