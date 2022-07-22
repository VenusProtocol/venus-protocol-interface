import type { TransactionReceipt } from 'web3-core';

import { GovernorBravoDelegate } from 'types/contracts';

export interface CancelProposalInput {
  governorBravoContract: GovernorBravoDelegate;
  accountAddress: string;
  proposalId: number;
}

export type CancelProposalOutput = TransactionReceipt;

const cancelProposal = async ({
  governorBravoContract,
  accountAddress,
  proposalId,
}: CancelProposalInput): Promise<CancelProposalOutput> =>
  governorBravoContract.methods.cancel(proposalId).send({ from: accountAddress });

export default cancelProposal;
