import BigNumber from 'bignumber.js';
import type { GovernorBravoDelegate } from 'libs/contracts';

export interface GetProposalMinQuorumVotesInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
}

export interface GetProposalMinQuorumVotesOutput {
  proposalMinQuorumVotesMantissa: BigNumber;
}

export const getProposalMinQuorumVotes = async ({
  governorBravoDelegateContract,
}: GetProposalMinQuorumVotesInput): Promise<GetProposalMinQuorumVotesOutput> => {
  const res = await governorBravoDelegateContract.quorumVotes();

  return {
    proposalMinQuorumVotesMantissa: new BigNumber(res.toString()),
  };
};
