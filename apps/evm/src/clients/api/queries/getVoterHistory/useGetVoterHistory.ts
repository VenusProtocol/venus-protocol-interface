import { type QueryObserverOptions, keepPreviousData, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { type GetVoterHistoryInput, type GetVoterHistoryOutput, getVoterHistory } from '.';

type Options = QueryObserverOptions<
  GetVoterHistoryOutput,
  Error,
  GetVoterHistoryOutput,
  GetVoterHistoryOutput,
  [FunctionKey.GET_VOTER_HISTORY, GetVoterHistoryInput]
>;

export const useGetVoterHistory = (params: GetVoterHistoryInput, options?: Partial<Options>) =>
  useQuery({
    queryKey: [FunctionKey.GET_VOTER_HISTORY, params],
    queryFn: () => getVoterHistory(params),
    placeholderData: keepPreviousData,
    ...options,
  });
