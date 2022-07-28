import { QueryObserverOptions, useQuery } from 'react-query';

import getVoters, { GetVotersInput, GetVotersOutput } from 'clients/api/queries/getVoters';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVotersOutput,
  Error,
  GetVotersOutput,
  GetVotersOutput,
  [FunctionKey.GET_VOTERS, GetVotersInput]
>;

const useGetVoters = (params: GetVotersInput, options?: Options) =>
  // This endpoint is paginated so we keep the previous responses by default to create a more seamless paginating experience
  useQuery([FunctionKey.GET_VOTERS, params], () => getVoters(params), {
    keepPreviousData: true,
    refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    ...options,
  });

export default useGetVoters;
