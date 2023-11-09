import { ContractTransaction } from 'ethers';
import { GovernorBravoDelegate } from 'packages/contracts';

export interface ExecuteProposalInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
  proposalId: number;
}

export type ExecuteProposalOutput = ContractTransaction;

const executeProposal = async ({
  governorBravoDelegateContract,
  proposalId,
}: ExecuteProposalInput): Promise<ExecuteProposalOutput> =>
  governorBravoDelegateContract.execute(proposalId);

export default executeProposal;
