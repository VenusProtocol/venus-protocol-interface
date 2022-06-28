import { useQuery, QueryObserverOptions } from 'react-query';
import FunctionKey from 'constants/functionKey';
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
    ...options,
  });

export default useGetVoterAccounts;
