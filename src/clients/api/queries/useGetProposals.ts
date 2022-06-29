import { useQuery, QueryObserverOptions } from 'react-query';
import getProposals, {
  IGetProposalsInput,
  IGetProposalsOutput,
} from 'clients/api/queries/getProposals';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  IGetProposalsOutput,
  Error,
  IGetProposalsOutput,
  IGetProposalsOutput,
  [FunctionKey.GET_PROPOSALS, IGetProposalsInput]
>;

const useGetProposals = (params: IGetProposalsInput = {}, options?: Options) =>
  // This endpoint is paginated so we keep the previous responses by default to create a more seamless paginating experience
  useQuery([FunctionKey.GET_PROPOSALS, params], () => getProposals(params), {
    keepPreviousData: true,
    refetchInterval: params.page === 0 ? 15000 : undefined,
    ...options,
  });

export default useGetProposals;
