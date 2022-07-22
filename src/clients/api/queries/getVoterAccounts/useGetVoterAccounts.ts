import { QueryObserverOptions, useQuery } from 'react-query';

import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';

import getVoterAccounts, { GetVoterAccountsInput, GetVoterAccountsOutput } from '.';

type Options = QueryObserverOptions<
  GetVoterAccountsOutput,
  Error,
  GetVoterAccountsOutput,
  GetVoterAccountsOutput,
  [FunctionKey.GET_VOTER_ACCOUNTS, GetVoterAccountsInput]
>;

const useGetVoterAccounts = (params: GetVoterAccountsInput = {}, options?: Options) =>
  // This endpoint is paginated so we keep the previous responses by default to create a more seamless paginating experience
  useQuery([FunctionKey.GET_VOTER_ACCOUNTS, params], () => getVoterAccounts(params), {
    keepPreviousData: true,
    refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    ...options,
  });

export default useGetVoterAccounts;
