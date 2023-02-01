import { ContractReceipt } from 'ethers';

import { GovernorBravoDelegate } from 'types/contracts';

export interface QueueProposalInput {
  governorBravoContract: GovernorBravoDelegate;
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
