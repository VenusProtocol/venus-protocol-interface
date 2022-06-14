import { useQuery, QueryObserverOptions } from 'react-query';

import getCurrentVotes, {
  IGetCurrentVotesInput,
  GetCurrentVotesOutput,
} from 'clients/api/queries/getCurrentVotes';
import FunctionKey from 'constants/functionKey';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  GetCurrentVotesOutput,
  Error,
  GetCurrentVotesOutput,
  GetCurrentVotesOutput,
  [FunctionKey.GET_CURRENT_VOTES, string]
>;

const useGetCurrentVotes = (
  { accountAddress }: Omit<IGetCurrentVotesInput, 'xvsVaultContract'>,
  options?: Options,
) => {
  const xvsVaultContract = useXvsVaultProxyContract();
  return useQuery(
    [FunctionKey.GET_CURRENT_VOTES, accountAddress],
    () => getCurrentVotes({ xvsVaultContract, accountAddress }),
    options,
  );
};

export default useGetCurrentVotes;
