import { QueryObserverOptions, useQuery } from 'react-query';

import getVoterDetails, {
  GetVoterDetailsInput,
  GetVoterDetailsOutput,
} from 'clients/api/queries/getVoterDetails';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVoterDetailsOutput,
  Error,
  GetVoterDetailsOutput,
  GetVoterDetailsOutput,
  [FunctionKey.GET_VOTER_DETAILS, GetVoterDetailsInput]
>;

const useGetVoterDetails = (params: GetVoterDetailsInput, options?: Options) =>
  // This endpoint is paginated so we keep the previous responses by default to create a more seamless paginating experience
  useQuery([FunctionKey.GET_VOTER_DETAILS, params], () => getVoterDetails(params), {
    refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    ...options,
  });

export default useGetVoterDetails;
