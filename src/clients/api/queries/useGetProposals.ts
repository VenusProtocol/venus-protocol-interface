import { useQuery, QueryObserverOptions } from 'react-query';
import getProposals, {
  IGetProposalsInput,
  IGetProposalsOutput,
} from 'clients/api/queries/getProposals';
import FunctionKey from 'constants/functionKey';
import { STANDARD_REFETCH_INTERVAL_MS } from 'constants/standardRefetchInterval';

type Options = QueryObserverOptions<
  IGetProposalsOutput,
  Error,
  IGetProposalsOutput,
  IGetProposalsOutput,
  [FunctionKey.GET_PROPOSALS, IGetProposalsInput]
>;

const useGetProposals = (params: IGetProposalsInput = {}, options?: Options) =>
  // This endpoint is paginated so we keep the previous responses by default to
  // create a more seamless paginating experience
  useQuery([FunctionKey.GET_PROPOSALS, params], () => getProposals(params), {
    keepPreviousData: true,
    placeholderData: { limit: 0, total: 0, offset: 0, proposals: [] },
    refetchInterval: params.page === 0 ? STANDARD_REFETCH_INTERVAL_MS : undefined,
    ...options,
  });

export default useGetProposals;
