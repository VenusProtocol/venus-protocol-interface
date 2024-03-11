import type { ContractTransaction } from 'ethers';

import type { GovernorBravoDelegate } from 'libs/contracts';

export interface CancelProposalInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
  proposalId: number;
}

export type CancelProposalOutput = ContractTransaction;

const cancelProposal = async ({
  governorBravoDelegateContract,
  proposalId,
}: CancelProposalInput): Promise<CancelProposalOutput> =>
  governorBravoDelegateContract.cancel(proposalId);

export default cancelProposal;
