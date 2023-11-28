import { QueryObserverOptions, useQuery } from 'react-query';

import getVoters, { GetVotersInput, GetVotersOutput } from 'clients/api/queries/getVoters';
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

const useGetVoters = (params: GetVotersInput, options?: Options) =>
  // This endpoint is paginated so we keep the previous responses by default to create a more seamless paginating experience
  useQuery([FunctionKey.GET_VOTERS, params], () => getVoters(params), {
    keepPreviousData: true,
    refetchInterval,
    ...options,
  });

export default useGetVoters;
