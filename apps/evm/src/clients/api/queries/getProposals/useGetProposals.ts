import { CHAIN_METADATA } from '@venusprotocol/web3';
import { QueryObserverOptions, useQuery } from 'react-query';

import getProposals, {
  GetProposalsInput,
  GetProposalsOutput,
} from 'clients/api/queries/getProposals';
import FunctionKey from 'constants/functionKey';
import { governanceChain } from 'libs/wallet';

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
) => {
  const { blockTimeMs } = CHAIN_METADATA[governanceChain.id];

  // This endpoint is paginated so we keep the previous responses by default to
  // create a more seamless paginating experience
  return useQuery([FunctionKey.GET_PROPOSALS, params], () => getProposals(params), {
    keepPreviousData: true,
    placeholderData: { limit: 0, total: 0, page: 0, proposals: [] },
    refetchInterval: params.page === 0 ? blockTimeMs * 5 : undefined,
    ...options,
  });
};

export default useGetProposals;
