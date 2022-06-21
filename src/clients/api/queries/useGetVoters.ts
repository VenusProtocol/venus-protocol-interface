import { useQuery, QueryObserverOptions } from 'react-query';
import getVoters, { IGetVotersInput, GetVotersOutput } from 'clients/api/queries/getVoters';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVotersOutput,
  Error,
  GetVotersOutput,
  GetVotersOutput,
  [FunctionKey.GET_VOTERS, IGetVotersInput]
>;

const useGetProposals = (params: IGetVotersInput, options?: Options) =>
  // This endpoint is paginated so we keep the previous responses by default to create a more seamless paginating experience
  useQuery([FunctionKey.GET_VOTERS, params], () => getVoters(params), {
    keepPreviousData: true,
    ...options,
  });

export default useGetProposals;
