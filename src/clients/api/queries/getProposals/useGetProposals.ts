import { QueryObserverOptions, useQuery } from 'react-query';

import getProposals, {
  GetProposalsInput,
  GetProposalsOutput,
} from 'clients/api/queries/getProposals';
import { BLOCK_TIME_MS } from 'constants/bsc';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetProposalsOutput,
  Error,
  GetProposalsOutput,
  GetProposalsOutput,
  [FunctionKey.GET_PROPOSALS, GetProposalsInput]
>;

const useGetProposals = (
  params: GetProposalsInput = { accountAddress: undefined },
  options?: Options,
) =>
  // This endpoint is paginated so we keep the previous responses by default to
  // create a more seamless paginating experience
  useQuery([FunctionKey.GET_PROPOSALS, params], () => getProposals(params), {
    keepPreviousData: true,
    placeholderData: { limit: 0, total: 0, page: 0, proposals: [] },
    refetchInterval: params.page === 0 ? BLOCK_TIME_MS * 5 : undefined,
    ...options,
  });

export default useGetProposals;
