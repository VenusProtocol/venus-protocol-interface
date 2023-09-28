import { ContractReceipt } from 'ethers';
import { GovernorBravoDelegate } from 'packages/contractsNew';

export interface CastVoteInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
  proposalId: number;
  voteType: 0 | 1 | 2;
}

export type CastVoteOutput = ContractReceipt;

const castVote = async ({
  governorBravoDelegateContract,
  proposalId,
  voteType,
}: CastVoteInput): Promise<CastVoteOutput> => {
  const transaction = await governorBravoDelegateContract.castVote(proposalId, voteType);
  return transaction.wait(1);
};

export default castVote;
