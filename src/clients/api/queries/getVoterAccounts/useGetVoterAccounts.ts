import { useQuery, QueryObserverOptions } from 'react-query';
import FunctionKey from 'constants/functionKey';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import getVoterAccounts, { IGetVoterAccountsInput, IGetVoterAccountsOutput } from '.';

type Options = QueryObserverOptions<
  IGetVoterAccountsOutput,
  Error,
  IGetVoterAccountsOutput,
  IGetVoterAccountsOutput,
  [FunctionKey.GET_VOTER_ACCOUNTS, IGetVoterAccountsInput]
>;

const useGetVoterAccounts = (params: IGetVoterAccountsInput = {}, options?: Options) =>
  // This endpoint is paginated so we keep the previous responses by default to create a more seamless paginating experience
  useQuery([FunctionKey.GET_VOTER_ACCOUNTS, params], () => getVoterAccounts(params), {
    keepPreviousData: true,
    refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    ...options,
  });

export default useGetVoterAccounts;
