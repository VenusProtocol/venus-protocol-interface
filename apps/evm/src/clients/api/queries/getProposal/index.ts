import type BigNumber from 'bignumber.js';
import {
  type GetBscProposalInput as GetBscGqlProposalInput,
  formatToProposal,
  getBscProposal as getBscGqlProposal,
} from 'clients/subgraph';
import { VError } from 'libs/errors';
import type { ChainId, Proposal } from 'types';

export interface GetProposalInput {
  proposalId: number;
  chainId: ChainId;
  currentBlockNumber: number;
  proposalMinQuorumVotesMantissa: BigNumber;
  blockTimeMs: number;
  proposalExecutionGracePeriodMs: number;
  accountAddress?: string;
}

export type GetProposalOutput = {
  proposal?: Proposal;
};

export const getProposal = async ({
  proposalId,
  chainId,
  currentBlockNumber,
  proposalMinQuorumVotesMantissa,
  proposalExecutionGracePeriodMs,
  blockTimeMs,
  accountAddress,
}: GetProposalInput): Promise<GetProposalOutput> => {
  const variables: GetBscGqlProposalInput['variables'] = {
    id: proposalId.toString(),
  };

  const response = await getBscGqlProposal({
    chainId,
    variables,
  });

  const gqlProposal = response?.proposal;

  if (!gqlProposal) {
    throw new VError({
      type: 'proposal',
      code: 'proposalNotFound',
    });
  }

  const proposal = formatToProposal({
    gqlProposal,
    proposalMinQuorumVotesMantissa,
    proposalExecutionGracePeriodMs,
    currentBlockNumber,
    blockTimeMs,
    accountAddress,
  });

  return { proposal };
};
