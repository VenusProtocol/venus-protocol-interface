import { ContractReceipt } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

export interface CastVoteInput {
  governorBravoDelegateContract: ContractTypeByName<'governorBravoDelegate'>;
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
