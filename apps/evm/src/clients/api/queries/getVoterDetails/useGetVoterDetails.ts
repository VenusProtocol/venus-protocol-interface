import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import getVoterDetails, {
  type GetVoterDetailsInput,
  type GetVoterDetailsOutput,
} from 'clients/api/queries/getVoterDetails';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVoterDetailsOutput,
  Error,
  GetVoterDetailsOutput,
  GetVoterDetailsOutput,
  [FunctionKey.GET_VOTER_DETAILS, GetVoterDetailsInput]
>;

const useGetVoterDetails = (params: GetVoterDetailsInput, options?: Partial<Options>) =>
  useQuery({
    queryKey: [FunctionKey.GET_VOTER_DETAILS, params],
    queryFn: () => getVoterDetails(params),
    ...options,
  });

export default useGetVoterDetails;
