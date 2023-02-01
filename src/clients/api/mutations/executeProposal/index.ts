import { ContractReceipt } from 'ethers';

import { GovernorBravoDelegate } from 'types/contracts';

export interface ExecuteProposalInput {
  governorBravoContract: GovernorBravoDelegate;
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
