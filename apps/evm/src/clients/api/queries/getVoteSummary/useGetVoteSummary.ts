import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

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

const useGetVoteSummary = (params: GetVoteSummaryInput, options?: Partial<Options>) =>
  useQuery({
    queryKey: [FunctionKey.GET_VOTE_SUMMARY, params],
    queryFn: () => getVoteSummary(params),
    refetchInterval,
    ...options,
  });

export default useGetVoteSummary;
