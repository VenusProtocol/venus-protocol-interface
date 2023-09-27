import { QueryObserverOptions, useQuery } from 'react-query';

import getVoteSummary, {
  GetVoteSummaryInput,
  GetVoteSummaryOutput,
} from 'clients/api/queries/getVoteSummary';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVoteSummaryOutput,
  Error,
  GetVoteSummaryOutput,
  GetVoteSummaryOutput,
  [FunctionKey.GET_VOTE_SUMMARY, GetVoteSummaryInput]
>;

const useGetVoteSummary = (params: GetVoteSummaryInput, options?: Options) =>
  useQuery([FunctionKey.GET_VOTE_SUMMARY, params], () => getVoteSummary(params), {
    refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    ...options,
  });

export default useGetVoteSummary;
