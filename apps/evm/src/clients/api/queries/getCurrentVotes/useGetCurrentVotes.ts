import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';

import getCurrentVotes, {
  type GetCurrentVotesInput,
  type GetCurrentVotesOutput,
} from 'clients/api/queries/getCurrentVotes';
import FunctionKey from 'constants/functionKey';
import { useGetXvsVaultContractAddress } from 'libs/contracts';
import { governanceChain } from 'libs/wallet';
import { callOrThrow } from 'utilities';

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

const useGetCurrentVotes = (input: TrimmedGetCurrentVotesInput, options?: Partial<Options>) => {
  const publicClient = usePublicClient({
    chainId: governanceChain.id,
  });
  const xvsVaultContractAddress = useGetXvsVaultContractAddress();

  return useQuery({
    queryKey: [FunctionKey.GET_CURRENT_VOTES, input],
    queryFn: () =>
      callOrThrow({ xvsVaultContractAddress }, params =>
        getCurrentVotes({ publicClient, ...params, ...input }),
      ),
    ...options,
  });
};

export default useGetCurrentVotes;
