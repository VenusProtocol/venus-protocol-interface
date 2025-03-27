import { type QueryObserverOptions, keepPreviousData, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { generatePseudoRandomRefetchInterval } from 'utilities';
import { type GetVotersInput, type GetVotersOutput, getVoters } from '.';

type Options = QueryObserverOptions<
  GetVotersOutput,
  Error,
  GetVotersOutput,
  GetVotersOutput,
  [FunctionKey.GET_VOTERS, GetVotersInput]
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

export const useGetVoters = (params: GetVotersInput, options?: Partial<Options>) =>
  useQuery({
    queryKey: [FunctionKey.GET_VOTERS, params],
    queryFn: () => getVoters(params),
    placeholderData: keepPreviousData,
    refetchInterval,
    ...options,
  });
