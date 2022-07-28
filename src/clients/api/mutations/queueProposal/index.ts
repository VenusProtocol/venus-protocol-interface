import type { TransactionReceipt } from 'web3-core';

import { GovernorBravoDelegate } from 'types/contracts';

export interface QueueProposalInput {
  governorBravoContract: GovernorBravoDelegate;
  accountAddress: string;
  proposalId: number;
}

export type QueueProposalOutput = TransactionReceipt;

const queueProposal = async ({
  governorBravoContract,
  accountAddress,
  proposalId,
}: QueueProposalInput): Promise<QueueProposalOutput> =>
  governorBravoContract.methods.queue(proposalId).send({ from: accountAddress });

export default queueProposal;
