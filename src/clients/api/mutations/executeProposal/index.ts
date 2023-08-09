import { ContractReceipt } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

export interface ExecuteProposalInput {
  governorBravoDelegateContract: ContractTypeByName<'governorBravoDelegate'>;
  proposalId: number;
}

export type ExecuteProposalOutput = ContractReceipt;

const executeProposal = async ({
  governorBravoDelegateContract,
  proposalId,
}: ExecuteProposalInput): Promise<ExecuteProposalOutput> => {
  const transaction = await governorBravoDelegateContract.execute(proposalId);
  return transaction.wait(1);
};

export default executeProposal;
