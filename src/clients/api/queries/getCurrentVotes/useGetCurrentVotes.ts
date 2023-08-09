import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getCurrentVotes, {
  GetCurrentVotesInput,
  GetCurrentVotesOutput,
} from 'clients/api/queries/getCurrentVotes';
import { useGetUniqueContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';

type TrimmedGetCurrentVotesInput = Omit<GetCurrentVotesInput, 'xvsVaultContract'>;
type Options = QueryObserverOptions<
  GetCurrentVotesOutput,
  Error,
  GetCurrentVotesOutput,
  GetCurrentVotesOutput,
  [FunctionKey.GET_CURRENT_VOTES, TrimmedGetCurrentVotesInput]
>;

const useGetCurrentVotes = (input: TrimmedGetCurrentVotesInput, options?: Options) => {
  const xvsVaultContract = useGetUniqueContract({
    name: 'xvsVault',
  });

  return useQuery(
    [FunctionKey.GET_CURRENT_VOTES, input],
    () => callOrThrow({ xvsVaultContract }, params => getCurrentVotes({ ...params, ...input })),
    options,
  );
};

export default useGetCurrentVotes;
