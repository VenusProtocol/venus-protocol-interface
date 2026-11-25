import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import { useGetBlockNumber } from 'clients/api/queries/getBlockNumber/useGetBlockNumber';
import { useGetProposalMinQuorumVotes } from 'clients/api/queries/getProposalMinQuorumVotes/useGetProposalMinQuorumVotes';
import FunctionKey from 'constants/functionKey';
import { governanceChainId } from 'libs/wallet';
import callOrThrow from 'utilities/callOrThrow';
import { generatePseudoRandomRefetchInterval } from 'utilities/generatePseudoRandomRefetchInterval';
import { type GetProposalsInput, type GetProposalsOutput, getProposals } from '.';
import { setUserVoteSupport } from './setUserVoteSupport';

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
      'currentBlockNumber' | 'proposalMinQuorumVotesMantissa' | 'blockTimeMs' | 'accountAddress'
    >,
  ]
>;

const refetchInterval = generatePseudoRandomRefetchInterval('fast');
const FIRST_PAGE_REFETCH_INTERVAL_MS = 30000;

export const useGetProposals = (
  input: TrimmedGetProposalsInput = {},
  options?: Partial<Options>,
) => {
  const { data: getProposalMinQuorumVotesData } = useGetProposalMinQuorumVotes();
  const proposalMinQuorumVotesMantissa =
    getProposalMinQuorumVotesData?.proposalMinQuorumVotesMantissa;

  const { data: getBlockNumberData } = useGetBlockNumber(
    {
      chainId: governanceChainId,
    },
    {
      refetchInterval,
    },
  );
  const currentBlockNumber = getBlockNumberData?.blockNumber;

  const { accountAddress, ...requestInput } = input;

  const sanitizedInput: Omit<TrimmedGetProposalsInput, 'accountAddress'> = {
    ...requestInput,
    page: requestInput.page ?? 0,
    limit: requestInput.limit ?? 10,
  };

  return useQuery({
    queryKey: [
      FunctionKey.GET_PROPOSALS,
      {
        ...sanitizedInput,
        // We will check that the current block number exists through the enabled parameter
        chainId: governanceChainId,
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
            chainId: governanceChainId,
          }),
      ),
    placeholderData: a =>
      a ?? {
        limit: sanitizedInput.limit,
        page: sanitizedInput.page,
        total: 0,
        proposals: [],
      },
    select: data => setUserVoteSupport({ data, accountAddress }),
    refetchInterval: sanitizedInput.page === 0 ? FIRST_PAGE_REFETCH_INTERVAL_MS : undefined,
    ...options,
    enabled:
      typeof currentBlockNumber === 'number' &&
      !!proposalMinQuorumVotesMantissa &&
      (options?.enabled === undefined || options?.enabled),
  });
};
