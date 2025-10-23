import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { governanceChainId, usePublicClient } from 'libs/wallet';
import { callOrThrow } from 'utilities';
import { type GetCurrentVotesInput, type GetCurrentVotesOutput, getCurrentVotes } from '.';

type TrimmedGetCurrentVotesInput = Omit<
  GetCurrentVotesInput,
  'xvsVaultContractAddress' | 'publicClient'
>;

export type UseGetCurrentVotesQueryKey = [
  FunctionKey.GET_CURRENT_VOTES,
  TrimmedGetCurrentVotesInput,
];

type Options = QueryObserverOptions<
  GetCurrentVotesOutput,
  Error,
  GetCurrentVotesOutput,
  GetCurrentVotesOutput,
  UseGetCurrentVotesQueryKey
>;

export const useGetCurrentVotes = (
  input: TrimmedGetCurrentVotesInput,
  options?: Partial<Options>,
) => {
  const { publicClient } = usePublicClient({
    chainId: governanceChainId,
  });
  const { address: xvsVaultContractAddress } = useGetContractAddress({
    name: 'XvsVault',
  });

  return useQuery({
    queryKey: [FunctionKey.GET_CURRENT_VOTES, input],
    queryFn: () =>
      callOrThrow({ xvsVaultContractAddress }, params =>
        getCurrentVotes({ publicClient, ...params, ...input }),
      ),
    ...options,
  });
};
