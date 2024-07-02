import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import getCurrentVotes, {
  type GetCurrentVotesInput,
  type GetCurrentVotesOutput,
} from 'clients/api/queries/getCurrentVotes';
import FunctionKey from 'constants/functionKey';
import { useGetXvsVaultContract } from 'libs/contracts';
import { governanceChain } from 'libs/wallet';
import { callOrThrow } from 'utilities';

type TrimmedGetCurrentVotesInput = Omit<GetCurrentVotesInput, 'xvsVaultContract'>;

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
  const xvsVaultContract = useGetXvsVaultContract({
    chainId: governanceChain.id,
  });

  return useQuery({
    queryKey: [FunctionKey.GET_CURRENT_VOTES, input],
    queryFn: () =>
      callOrThrow({ xvsVaultContract }, params => getCurrentVotes({ ...params, ...input })),
    ...options,
  });
};

export default useGetCurrentVotes;
