import { ContractReceipt } from 'ethers';
import { GovernorBravoDelegate } from 'packages/contractsNew';

export interface ExecuteProposalInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
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
