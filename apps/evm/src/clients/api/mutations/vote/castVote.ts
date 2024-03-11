import type { ContractTransaction } from 'ethers';

import type { GovernorBravoDelegate } from 'libs/contracts';

export interface CastVoteInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
  proposalId: number;
  voteType: 0 | 1 | 2;
}

export type CastVoteOutput = ContractTransaction;

const castVote = async ({
  governorBravoDelegateContract,
  proposalId,
  voteType,
}: CastVoteInput): Promise<CastVoteOutput> =>
  governorBravoDelegateContract.castVote(proposalId, voteType);

export default castVote;
