import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import useGetBlockNumber from 'clients/api/queries/getBlockNumber/useGetBlockNumber';
import { useGetProposalMinQuorumVotes } from 'clients/api/queries/getProposalMinQuorumVotes/useGetProposalMinQuorumVotes';
import {
  type GetProposalsInput,
  type GetProposalsOutput,
  getProposals,
} from 'clients/api/queries/getProposals';
import { CHAIN_METADATA } from 'constants/chainMetadata';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';
import { governanceChain } from 'libs/wallet';
import { callOrThrow } from 'utilities';

type TrimmedGetProposalPreviewsInput = Omit<
  GetProposalsInput,
  | 'chainId'
  | 'proposalMinQuorumVotesMantissa'
  | 'proposalExecutionGracePeriodMs'
  | 'currentBlockNumber'
  | 'blockTimeMs'
>;

type Options = QueryObserverOptions<
  GetProposalsOutput,
  Error,
  GetProposalsOutput,
  GetProposalsOutput,
  [
    FunctionKey.GET_PROPOSALS,
    Omit<
      GetProposalsInput,
      | 'currentBlockNumber'
      | 'proposalMinQuorumVotesMantissa'
      | 'blockTimeMs'
      | 'proposalExecutionGracePeriodMs'
    >,
  ]
>;

export const useGetProposals = (
  input: TrimmedGetProposalPreviewsInput = {},
  options?: Partial<Options>,
) => {
  const { data: getProposalMinQuorumVotesData } = useGetProposalMinQuorumVotes();
  const proposalMinQuorumVotesMantissa =
    getProposalMinQuorumVotesData?.proposalMinQuorumVotesMantissa;

  const { data: getBlockNumberData } = useGetBlockNumber({
    chainId: governanceChain.id,
  });
  const currentBlockNumber = getBlockNumberData?.blockNumber;

  const { blockTimeMs, proposalExecutionGracePeriodMs } = CHAIN_METADATA[governanceChain.id];

  const sanitizedInput: TrimmedGetProposalPreviewsInput = {
    ...input,
    page: input.page ?? 0,
    limit: input.limit ?? 10,
  };

  return useQuery({
    queryKey: [
      FunctionKey.GET_PROPOSALS,
      {
        ...sanitizedInput,
        // We will check that the current block number exists through the enabled parameter
        chainId: governanceChain.id,
      },
    ],
    queryFn: () => {
      return callOrThrow(
        {
          currentBlockNumber,
          proposalMinQuorumVotesMantissa,
          proposalExecutionGracePeriodMs,
          blockTimeMs,
        },
        params =>
          getProposals({
            ...sanitizedInput,
            ...params,
            chainId: governanceChain.id,
          }),
      );
    },
    placeholderData: a =>
      a ?? {
        limit: sanitizedInput.limit,
        page: sanitizedInput.page,
        total: 0,
        proposals: [],
      },
    refetchInterval:
      sanitizedInput.page === 0 ? (blockTimeMs || DEFAULT_REFETCH_INTERVAL_MS) * 5 : undefined,
    ...options,
    enabled:
      typeof currentBlockNumber === 'number' &&
      !!proposalMinQuorumVotesMantissa &&
      (options?.enabled === undefined || options?.enabled),
  });
};
