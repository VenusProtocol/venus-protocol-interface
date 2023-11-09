import { ContractTransaction } from 'ethers';
import { GovernorBravoDelegate } from 'packages/contracts';

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
