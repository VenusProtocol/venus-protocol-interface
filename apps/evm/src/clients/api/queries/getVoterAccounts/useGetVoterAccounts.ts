import { type QueryObserverOptions, keepPreviousData, useQuery } from '@tanstack/react-query';

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

const useGetVoterAccounts = (params: GetVoterAccountsInput, options?: Partial<Options>) =>
  useQuery({
    queryKey: [FunctionKey.GET_VOTER_ACCOUNTS, params],
    queryFn: () => getVoterAccounts(params),
    placeholderData: keepPreviousData,
    refetchInterval,
    ...options,
  });

export default useGetVoterAccounts;
