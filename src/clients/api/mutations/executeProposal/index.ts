import { ContractReceipt } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

export interface ExecuteProposalInput {
  governorBravoContract: ContractTypeByName<'governorBravoDelegate'>;
  proposalId: number;
}

export type ExecuteProposalOutput = ContractReceipt;

const executeProposal = async ({
  governorBravoContract,
  proposalId,
}: ExecuteProposalInput): Promise<ExecuteProposalOutput> => {
  const transaction = await governorBravoContract.execute(proposalId);
  return transaction.wait(1);
};

export default executeProposal;
