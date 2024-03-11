import { type QueryObserverOptions, useQuery } from 'react-query';

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

const useGetVoterDetails = (params: GetVoterDetailsInput, options?: Options) =>
  useQuery([FunctionKey.GET_VOTER_DETAILS, params], () => getVoterDetails(params), options);

export default useGetVoterDetails;
