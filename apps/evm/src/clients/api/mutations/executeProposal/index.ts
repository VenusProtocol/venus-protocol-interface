import type { GovernorBravoDelegate, OmnichainGovernanceExecutor } from 'libs/contracts';
import type { ContractTxData } from 'types';

export interface ExecuteProposalInput {
  contract: GovernorBravoDelegate | OmnichainGovernanceExecutor;
  proposalId: number;
}

export type ExecuteProposalOutput = ContractTxData<
  GovernorBravoDelegate | OmnichainGovernanceExecutor,
  'execute'
>;

const executeProposal = ({
  contract,
  proposalId,
}: ExecuteProposalInput): ExecuteProposalOutput => ({
  contract,
  methodName: 'execute',
  args: [proposalId],
});

export default executeProposal;
