import { useQuery, QueryObserverOptions } from 'react-query';
import getVoterHistory, {
  IGetVoterHistoryInput,
  IGetVoterHistoryOutput,
} from 'clients/api/queries/getVoterHistory';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  IGetVoterHistoryOutput,
  Error,
  IGetVoterHistoryOutput,
  IGetVoterHistoryOutput,
  [FunctionKey.GET_VOTER_HISTORY, IGetVoterHistoryInput]
>;

const useGetVoterHistory = (params: IGetVoterHistoryInput, options?: Options) =>
  // This endpoint is paginated so we keep the previous responses by default to create a more seamless paginating experience
  useQuery([FunctionKey.GET_VOTER_HISTORY, params], () => getVoterHistory(params), {
    keepPreviousData: true,
    refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    ...options,
  });

export default useGetVoterHistory;
