import { useQuery, QueryObserverOptions } from 'react-query';
import getVoterHistory, {
  IGetVoterHistoryInput,
  IGetVoterHistoryOutput,
} from 'clients/api/queries/getVoterHistory';
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
    ...options,
  });

export default useGetVoterHistory;
