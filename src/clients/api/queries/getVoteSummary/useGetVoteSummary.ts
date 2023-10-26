import { QueryObserverOptions, useQuery } from 'react-query';
import { generatePseudoRandomRefetchInterval } from 'utilities';

import getVoteSummary, {
  GetVoteSummaryInput,
  GetVoteSummaryOutput,
} from 'clients/api/queries/getVoteSummary';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVoteSummaryOutput,
  Error,
  GetVoteSummaryOutput,
  GetVoteSummaryOutput,
  [FunctionKey.GET_VOTE_SUMMARY, GetVoteSummaryInput]
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

const useGetVoteSummary = (params: GetVoteSummaryInput, options?: Options) =>
  useQuery([FunctionKey.GET_VOTE_SUMMARY, params], () => getVoteSummary(params), {
    refetchInterval,
    ...options,
  });

export default useGetVoteSummary;
