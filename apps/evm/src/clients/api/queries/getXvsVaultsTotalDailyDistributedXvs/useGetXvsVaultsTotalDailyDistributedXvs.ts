import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import {
  type GetXvsVaultsTotalDailyDistributedXvsInput,
  type GetXvsVaultsTotalDailyDistributedXvsOutput,
  getXvsVaultsTotalDailyDistributedXvs,
} from 'clients/api/queries/getXvsVaultsTotalDailyDistributedXvs';
import FunctionKey from 'constants/functionKey';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useGetXvsVaultContractAddress } from 'libs/contracts';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedGetXvsVaultsTotalDailyDistributedXvsInput = Omit<
  GetXvsVaultsTotalDailyDistributedXvsInput,
  'publicClient' | 'xvsVaultContractAddress' | 'blocksPerDay'
>;

export type UseGetXvsVaultsTotalDailyDistributedXvsQueryKey = [
  FunctionKey.GET_XVS_VAULT_DAILY_REWARD_TOKENS,
  TrimmedGetXvsVaultsTotalDailyDistributedXvsInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetXvsVaultsTotalDailyDistributedXvsOutput,
  Error,
  GetXvsVaultsTotalDailyDistributedXvsOutput,
  GetXvsVaultsTotalDailyDistributedXvsOutput,
  UseGetXvsVaultsTotalDailyDistributedXvsQueryKey
>;

export const useGetXvsVaultsTotalDailyDistributedXvs = (
  input: TrimmedGetXvsVaultsTotalDailyDistributedXvsInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { blocksPerDay } = useGetChainMetadata();
  const { publicClient } = usePublicClient();
  const xvsVaultContractAddress = useGetXvsVaultContractAddress();

  return useQuery({
    queryKey: [FunctionKey.GET_XVS_VAULT_DAILY_REWARD_TOKENS, { ...input, chainId }],
    queryFn: () =>
      callOrThrow({ xvsVaultContractAddress }, params =>
        getXvsVaultsTotalDailyDistributedXvs({
          ...params,
          ...input,
          publicClient,
          blocksPerDay,
        }),
      ),
    ...options,
  });
};
