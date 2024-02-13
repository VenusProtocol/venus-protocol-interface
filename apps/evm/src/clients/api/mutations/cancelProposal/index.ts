import { ContractTransaction } from 'ethers';

import { GovernorBravoDelegate } from 'libs/contracts';

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
