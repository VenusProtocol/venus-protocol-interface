import { type QueryObserverOptions, keepPreviousData, useQuery } from '@tanstack/react-query';

import getVoters, {
  type GetVotersInput,
  type GetVotersOutput,
} from 'clients/api/queries/getVoters';
import FunctionKey from 'constants/functionKey';
import { generatePseudoRandomRefetchInterval } from 'utilities';

type Options = QueryObserverOptions<
  GetVotersOutput,
  Error,
  GetVotersOutput,
  GetVotersOutput,
  [FunctionKey.GET_VOTERS, GetVotersInput]
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

const useGetVoters = (params: GetVotersInput, options?: Partial<Options>) =>
  useQuery({
    queryKey: [FunctionKey.GET_VOTERS, params],
    queryFn: () => getVoters(params),
    placeholderData: keepPreviousData,
    refetchInterval,
    ...options,
  });

export default useGetVoters;
