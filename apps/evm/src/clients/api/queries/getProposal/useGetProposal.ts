import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import { chainMetadata } from '@venusprotocol/chains';

import {
  type GetProposalInput,
  type GetProposalOutput,
  getProposal,
} from 'clients/api/queries/getProposal';
import FunctionKey from 'constants/functionKey';
import { governanceChain } from 'libs/wallet';
import { callOrThrow } from 'utilities';
import useGetBlockNumber from '../getBlockNumber/useGetBlockNumber';
import { useGetProposalMinQuorumVotes } from '../getProposalMinQuorumVotes/useGetProposalMinQuorumVotes';
import { useGetCachedProposal } from './useGetCachedProposal';

type TrimmedGetProposalInput = Omit<
  GetProposalInput,
  'currentBlockNumber' | 'proposalMinQuorumVotesMantissa' | 'blockTimeMs' | 'chainId'
>;

type Options = QueryObserverOptions<
  GetProposalOutput,
  Error,
  GetProposalOutput,
  GetProposalOutput,
  [
    FunctionKey.GET_PROPOSAL,
    Omit<GetProposalInput, 'currentBlockNumber' | 'proposalMinQuorumVotesMantissa' | 'blockTimeMs'>,
  ]
>;

const { blockTimeMs: BSC_BLOCK_TIME_MS } = chainMetadata[governanceChain.id];

export const useGetProposal = (input: TrimmedGetProposalInput, options?: Partial<Options>) => {
  const { data: getProposalMinQuorumVotesData } = useGetProposalMinQuorumVotes();
  const proposalMinQuorumVotesMantissa =
    getProposalMinQuorumVotesData?.proposalMinQuorumVotesMantissa;

  const { data: getBlockNumberData } = useGetBlockNumber(
    {
      chainId: governanceChain.id,
    },
    {
      refetchInterval: BSC_BLOCK_TIME_MS,
    },
  );
  const currentBlockNumber = getBlockNumberData?.blockNumber;

  // Initialize proposal using cache if available
  const cachedProposal = useGetCachedProposal({
    proposalId: +input.proposalId,
  });

  return useQuery({
    queryKey: [
      FunctionKey.GET_PROPOSAL,
      {
        ...input,
        chainId: governanceChain.id,
      },
    ],
    queryFn: () =>
      callOrThrow(
        {
          currentBlockNumber,
          proposalMinQuorumVotesMantissa,
        },
        params =>
          getProposal({
            ...input,
            ...params,
            chainId: governanceChain.id,
          }),
      ),
    refetchInterval: BSC_BLOCK_TIME_MS,
    initialData: {
      proposal: cachedProposal,
    },
    refetchOnMount: false,
    ...options,
    enabled:
      typeof currentBlockNumber === 'number' &&
      !!proposalMinQuorumVotesMantissa &&
      (options?.enabled === undefined || options?.enabled),
  });
};
