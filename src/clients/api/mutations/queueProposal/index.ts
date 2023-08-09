import { ContractReceipt } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

export interface QueueProposalInput {
  governorBravoDelegateContract: ContractTypeByName<'governorBravoDelegate'>;
  proposalId: number;
}

export type QueueProposalOutput = ContractReceipt;

const queueProposal = async ({
  governorBravoDelegateContract,
  proposalId,
}: QueueProposalInput): Promise<QueueProposalOutput> => {
  const transaction = await governorBravoDelegateContract.queue(proposalId);
  return transaction.wait(1);
};

export default queueProposal;
