import type { GovernorBravoDelegate } from 'libs/contracts';
import type { ContractTxData } from 'types';

export interface ExecuteProposalInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
  proposalId: number;
}

export type ExecuteProposalOutput = ContractTxData<GovernorBravoDelegate, 'execute'>;

const executeProposal = ({
  governorBravoDelegateContract,
  proposalId,
}: ExecuteProposalInput): ExecuteProposalOutput => ({
  contract: governorBravoDelegateContract,
  methodName: 'execute',
  args: [proposalId],
});

export default executeProposal;
