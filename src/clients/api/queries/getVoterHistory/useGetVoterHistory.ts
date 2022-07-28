import { QueryObserverOptions, useQuery } from 'react-query';

import getVoterHistory, {
  GetVoterHistoryInput,
  GetVoterHistoryOutput,
} from 'clients/api/queries/getVoterHistory';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVoterHistoryOutput,
  Error,
  GetVoterHistoryOutput,
  GetVoterHistoryOutput,
  [FunctionKey.GET_VOTER_HISTORY, GetVoterHistoryInput]
>;

const useGetVoterHistory = (params: GetVoterHistoryInput, options?: Options) =>
  // This endpoint is paginated so we keep the previous responses by default to create a more seamless paginating experience
  useQuery([FunctionKey.GET_VOTER_HISTORY, params], () => getVoterHistory(params), {
    keepPreviousData: true,
    refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    ...options,
  });

export default useGetVoterHistory;
