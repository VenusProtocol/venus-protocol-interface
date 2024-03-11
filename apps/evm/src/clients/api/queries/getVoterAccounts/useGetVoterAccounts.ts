import { type QueryObserverOptions, useQuery } from 'react-query';

import FunctionKey from 'constants/functionKey';
import { generatePseudoRandomRefetchInterval } from 'utilities';

import getVoterAccounts, { type GetVoterAccountsInput, type GetVoterAccountsOutput } from '.';

type Options = QueryObserverOptions<
  GetVoterAccountsOutput,
  Error,
  GetVoterAccountsOutput,
  GetVoterAccountsOutput,
  [FunctionKey.GET_VOTER_ACCOUNTS, GetVoterAccountsInput]
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

const useGetVoterAccounts = (params: GetVoterAccountsInput, options?: Options) =>
  // This endpoint is paginated so we keep the previous responses by default to create a more seamless paginating experience
  useQuery([FunctionKey.GET_VOTER_ACCOUNTS, params], () => getVoterAccounts(params), {
    keepPreviousData: true,
    refetchInterval,
    ...options,
  });

export default useGetVoterAccounts;
