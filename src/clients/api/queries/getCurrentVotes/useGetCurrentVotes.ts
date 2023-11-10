import { useGetXvsVaultContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getCurrentVotes, {
  GetCurrentVotesInput,
  GetCurrentVotesOutput,
} from 'clients/api/queries/getCurrentVotes';
import { governanceChain } from 'clients/web3';
import FunctionKey from 'constants/functionKey';

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

const useGetCurrentVotes = (input: TrimmedGetCurrentVotesInput, options?: Options) => {
  const xvsVaultContract = useGetXvsVaultContract({
    chainId: governanceChain.id,
  });

  return useQuery(
    [FunctionKey.GET_CURRENT_VOTES, input],
    () => callOrThrow({ xvsVaultContract }, params => getCurrentVotes({ ...params, ...input })),
    options,
  );
};

export default useGetCurrentVotes;
