import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import { chains } from '@venusprotocol/chains';

import { useGetBlockNumber } from 'clients/api/queries/getBlockNumber/useGetBlockNumber';
import { useGetProposalMinQuorumVotes } from 'clients/api/queries/getProposalMinQuorumVotes/useGetProposalMinQuorumVotes';
import FunctionKey from 'constants/functionKey';
import { governanceChain } from 'libs/wallet';
import { callOrThrow } from 'utilities';
import { type GetProposalsInput, type GetProposalsOutput, getProposals } from '.';

type TrimmedGetProposalsInput = Omit<
  GetProposalsInput,
  'currentBlockNumber' | 'proposalMinQuorumVotesMantissa' | 'blockTimeMs' | 'chainId'
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
      'currentBlockNumber' | 'proposalMinQuorumVotesMantissa' | 'blockTimeMs'
    >,
  ]
>;

const { blockTimeMs: BSC_BLOCK_TIME_MS } = chains[governanceChain.id];

export const useGetProposals = (
  input: TrimmedGetProposalsInput = {},
  options?: Partial<Options>,
) => {
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

  const sanitizedInput: TrimmedGetProposalsInput = {
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
    queryFn: () =>
      callOrThrow(
        {
          currentBlockNumber,
          proposalMinQuorumVotesMantissa,
        },
        params =>
          getProposals({
            ...sanitizedInput,
            ...params,
            chainId: governanceChain.id,
          }),
      ),
    placeholderData: a =>
      a ?? {
        limit: sanitizedInput.limit,
        page: sanitizedInput.page,
        total: 0,
        proposals: [],
      },
    refetchInterval: sanitizedInput.page === 0 ? BSC_BLOCK_TIME_MS! * 5 : undefined,
    ...options,
    enabled:
      typeof currentBlockNumber === 'number' &&
      !!proposalMinQuorumVotesMantissa &&
      (options?.enabled === undefined || options?.enabled),
  });
};
