import { type QueryObserverOptions, keepPreviousData, useQuery } from '@tanstack/react-query';

import getVoterHistory, {
  type GetVoterHistoryInput,
  type GetVoterHistoryOutput,
} from 'clients/api/queries/getVoterHistory';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVoterHistoryOutput,
  Error,
  GetVoterHistoryOutput,
  GetVoterHistoryOutput,
  [FunctionKey.GET_VOTER_HISTORY, GetVoterHistoryInput]
>;

const useGetVoterHistory = (params: GetVoterHistoryInput, options?: Partial<Options>) =>
  useQuery({
    queryKey: [FunctionKey.GET_VOTER_HISTORY, params],
    queryFn: () => getVoterHistory(params),
    placeholderData: keepPreviousData,
    ...options,
  });

export default useGetVoterHistory;
