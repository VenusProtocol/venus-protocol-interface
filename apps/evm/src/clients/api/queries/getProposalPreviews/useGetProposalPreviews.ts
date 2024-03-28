import { type QueryObserverOptions, useQuery } from 'react-query';

import useGetBlockNumber from 'clients/api/queries/getBlockNumber/useGetBlockNumber';
import { useGetProposalMinQuorumVotes } from 'clients/api/queries/getProposalMinQuorumVotes/useGetProposalMinQuorumVotes';
import {
  type GetProposalPreviewsInput,
  type GetProposalPreviewsOutput,
  getProposalPreviews,
} from 'clients/api/queries/getProposalPreviews';
import { CHAIN_METADATA } from 'constants/chainMetadata';
import FunctionKey from 'constants/functionKey';
import { governanceChain } from 'libs/wallet';
import { callOrThrow } from 'utilities';

type TrimmedGetProposalPreviewsInput = Omit<
  GetProposalPreviewsInput,
  'chainId' | 'proposalMinQuorumVotesMantissa' | 'currentBlockNumber' | 'blockTimeMs'
>;

type Options = QueryObserverOptions<
  GetProposalPreviewsOutput,
  Error,
  GetProposalPreviewsOutput,
  GetProposalPreviewsOutput,
  [
    FunctionKey.GET_PROPOSAL_PREVIEWS,
    Omit<
      GetProposalPreviewsInput,
      'currentBlockNumber' | 'proposalMinQuorumVotesMantissa' | 'blockTimeMs'
    >,
  ]
>;

export const useGetProposalPreviews = (
  {
    page: unsafePage,
    limit: unsafeLimit,
    proposalState,
    search,
  }: TrimmedGetProposalPreviewsInput = {},
  options?: Options,
) => {
  const { data: getProposalMinQuorumVotesData } = useGetProposalMinQuorumVotes();
  const proposalMinQuorumVotesMantissa =
    getProposalMinQuorumVotesData?.proposalMinQuorumVotesMantissa;

  const { data: getBlockNumberData } = useGetBlockNumber({
    chainId: governanceChain.id,
  });
  const currentBlockNumber = getBlockNumberData?.blockNumber;

  const { blockTimeMs } = CHAIN_METADATA[governanceChain.id];
  const page = unsafePage ?? 0;
  const limit = unsafeLimit ?? 10;

  return useQuery(
    [
      FunctionKey.GET_PROPOSAL_PREVIEWS,
      {
        page,
        limit,
        proposalState,
        search,
        // We will check that the current block number exists through the enabled parameter
        chainId: governanceChain.id,
      },
    ],
    () => {
      return callOrThrow(
        {
          currentBlockNumber,
          proposalMinQuorumVotesMantissa,
        },
        sanitizedParams =>
          getProposalPreviews({
            ...sanitizedParams,
            page,
            limit,
            search,
            proposalState,
            blockTimeMs,
            chainId: governanceChain.id,
          }),
      );
    },
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
        typeof currentBlockNumber === 'number' &&
        !!proposalMinQuorumVotesMantissa &&
        (options?.enabled === undefined || options?.enabled),
    },
  );
};
