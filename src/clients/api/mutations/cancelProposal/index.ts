import { ContractReceipt } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

export interface CancelProposalInput {
  governorBravoDelegateContract: ContractTypeByName<'governorBravoDelegate'>;
  proposalId: number;
}

export type CancelProposalOutput = ContractReceipt;

const cancelProposal = async ({
  governorBravoDelegateContract,
  proposalId,
}: CancelProposalInput): Promise<CancelProposalOutput> => {
  const transaction = await governorBravoDelegateContract.cancel(proposalId);
  return transaction.wait(1);
};

export default cancelProposal;
