import { ContractTransaction } from 'ethers';

import { GovernorBravoDelegate } from 'packages/contracts';

export interface QueueProposalInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
  proposalId: number;
}

export type QueueProposalOutput = ContractTransaction;

const queueProposal = async ({
  governorBravoDelegateContract,
  proposalId,
}: QueueProposalInput): Promise<QueueProposalOutput> =>
  governorBravoDelegateContract.queue(proposalId);

export default queueProposal;
