import { ContractReceipt } from 'ethers';
import { GovernorBravoDelegate } from 'packages/contractsNew';

export interface QueueProposalInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
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
