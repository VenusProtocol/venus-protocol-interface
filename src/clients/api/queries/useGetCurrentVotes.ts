import { useQuery, QueryObserverOptions } from 'react-query';

import getCurrentVotes, {
  IGetCurrentVotesInput,
  GetCurrentVotesOutput,
} from 'clients/api/queries/getCurrentVotes';
import FunctionKey from 'constants/functionKey';
import { useXvsVaultContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  GetCurrentVotesOutput,
  Error,
  GetCurrentVotesOutput,
  GetCurrentVotesOutput,
  FunctionKey.GET_CURRENT_VOTES
>;

const useGetCurrentVotes = (
  { accountAddress }: Omit<IGetCurrentVotesInput, 'xvsVaultContract'>,
  options?: Options,
) => {
  const xvsVaultContract = useXvsVaultContract();
  return useQuery(
    FunctionKey.GET_CURRENT_VOTES,
    () => getCurrentVotes({ xvsVaultContract, accountAddress }),
    options,
  );
};

export default useGetCurrentVotes;
