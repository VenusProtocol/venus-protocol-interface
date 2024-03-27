import { type QueryObserverOptions, useQuery } from 'react-query';

import useGetBlockNumber from 'clients/api/queries/getBlockNumber/useGetBlockNumber';
import {
  type GetProposalPreviewsInput,
  type GetProposalPreviewsOutput,
  getProposalPreviews,
} from 'clients/api/queries/getProposalPreviews';
import { CHAIN_METADATA } from 'constants/chainMetadata';
import FunctionKey from 'constants/functionKey';
import { governanceChain } from 'libs/wallet';

type TrimmedGetProposalPreviewsInput = Omit<
  GetProposalPreviewsInput,
  'chainId' | 'currentBlockNumber' | 'blockTimeMs'
>;

type Options = QueryObserverOptions<
  GetProposalPreviewsOutput,
  Error,
  GetProposalPreviewsOutput,
  GetProposalPreviewsOutput,
  [
    FunctionKey.GET_PROPOSAL_PREVIEWS,
    Omit<GetProposalPreviewsInput, 'currentBlockNumber' | 'blockTimeMs'>,
  ]
>;

export const useGetProposalPreviews = (
  params: TrimmedGetProposalPreviewsInput = {},
  options?: Options,
) => {
  const { data } = useGetBlockNumber({
    chainId: governanceChain.id,
  });
  const { blockTimeMs } = CHAIN_METADATA[governanceChain.id];
  const page = params.page || 0;
  const limit = params.limit || 10;

  return useQuery(
    [
      FunctionKey.GET_PROPOSAL_PREVIEWS,
      {
        ...params,
        // We will check that the current block number exists through the enabled parameter
        chainId: governanceChain.id,
      },
    ],
    () =>
      getProposalPreviews({
        ...params,
        // We will check that the current block number exists through the enabled parameter
        currentBlockNumber: data?.blockNumber || 0,
        blockTimeMs,
        chainId: governanceChain.id,
      }),
    {
      keepPreviousData: true,
      placeholderData: {
        limit,
        page,
        total: 0,
        proposalPreviews: [],
      },
      refetchInterval: page === 0 ? blockTimeMs * 5 : undefined,
      ...options,
      enabled:
        typeof data?.blockNumber === 'number' &&
        (options?.enabled === undefined || options?.enabled),
    },
  );
};
