import { type QueryObserverOptions, useQuery } from 'react-query';

import getVoteSummary, {
  type GetVoteSummaryInput,
  type GetVoteSummaryOutput,
} from 'clients/api/queries/getVoteSummary';
import FunctionKey from 'constants/functionKey';
import { generatePseudoRandomRefetchInterval } from 'utilities';

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
