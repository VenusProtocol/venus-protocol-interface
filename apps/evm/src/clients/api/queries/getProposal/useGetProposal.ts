import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import { chainMetadata } from '@venusprotocol/chains';
import getProposal from 'clients/api/queries/getProposal';
import type { GetProposalInput, GetProposalOutput } from 'clients/api/queries/getProposal/types';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';
import { governanceChain } from 'libs/wallet';

export type UseGetProposalQueryKey = [FunctionKey.GET_PROPOSAL, GetProposalInput];

type Options = QueryObserverOptions<
  GetProposalOutput,
  Error,
  GetProposalOutput,
  GetProposalOutput,
  UseGetProposalQueryKey
>;

const useGetProposal = (params: GetProposalInput, options?: Partial<Options>) => {
  const { blockTimeMs } = chainMetadata[governanceChain.id];

  return useQuery({
    queryKey: [FunctionKey.GET_PROPOSAL, params],
    queryFn: () => getProposal(params),
    refetchInterval: blockTimeMs || DEFAULT_REFETCH_INTERVAL_MS,
    ...options,
  });
};

export default useGetProposal;
