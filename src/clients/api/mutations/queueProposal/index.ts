import { ContractReceipt } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

export interface QueueProposalInput {
  governorBravoContract: ContractTypeByName<'governorBravoDelegate'>;
  proposalId: number;
}

export type QueueProposalOutput = ContractReceipt;

const queueProposal = async ({
  governorBravoContract,
  proposalId,
}: QueueProposalInput): Promise<QueueProposalOutput> => {
  const transaction = await governorBravoContract.queue(proposalId);
  return transaction.wait(1);
};

export default queueProposal;
