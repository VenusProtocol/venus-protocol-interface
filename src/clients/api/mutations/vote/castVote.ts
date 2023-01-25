import { ContractReceipt } from 'ethers';

import { GovernorBravoDelegate } from 'types/contracts';

export interface CastVoteInput {
  governorBravoContract: GovernorBravoDelegate;
  proposalId: number;
  voteType: 0 | 1 | 2;
}

export type CastVoteOutput = ContractReceipt;

const castVote = async ({
  governorBravoContract,
  proposalId,
  voteType,
}: CastVoteInput): Promise<CastVoteOutput> => {
  const transaction = await governorBravoContract.castVote(proposalId, voteType);
  return transaction.wait(1);
};

export default castVote;
