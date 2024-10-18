import type BigNumber from 'bignumber.js';
import {
  type GetBscProposalInput as GetBscGqlProposalInput,
  enrichRemoteProposals,
  formatToProposal,
  getBscProposal,
} from 'clients/subgraph';
import { VError } from 'libs/errors';
import type { ChainId, Proposal } from 'types';

export interface GetProposalInput {
  proposalId: number;
  chainId: ChainId;
  currentBlockNumber: number;
  proposalMinQuorumVotesMantissa: BigNumber;
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
  accountAddress,
}: GetProposalInput): Promise<GetProposalOutput> => {
  const variables: GetBscGqlProposalInput['variables'] = {
    id: proposalId.toString(),
  };

  const response = await getBscProposal({
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

  // Fetch remote proposals
  const gqlRemoteProposalsMapping = await enrichRemoteProposals({
    gqlRemoteProposals: gqlProposal.remoteProposals,
  });

  const proposal = formatToProposal({
    gqlProposal,
    gqlRemoteProposalsMapping,
    proposalMinQuorumVotesMantissa,
    currentBlockNumber,
    accountAddress,
  });

  return { proposal };
};
