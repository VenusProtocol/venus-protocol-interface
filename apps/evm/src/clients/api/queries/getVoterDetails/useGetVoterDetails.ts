import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { type GetVoterDetailsInput, type GetVoterDetailsOutput, getVoterDetails } from '.';

type Options = QueryObserverOptions<
  GetVoterDetailsOutput,
  Error,
  GetVoterDetailsOutput,
  GetVoterDetailsOutput,
  [FunctionKey.GET_VOTER_DETAILS, GetVoterDetailsInput]
>;

export const useGetVoterDetails = (params: GetVoterDetailsInput, options?: Partial<Options>) =>
  useQuery({
    queryKey: [FunctionKey.GET_VOTER_DETAILS, params],
    queryFn: () => getVoterDetails(params),
    ...options,
  });
