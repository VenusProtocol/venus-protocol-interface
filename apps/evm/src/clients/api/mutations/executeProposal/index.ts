import type { GovernorBravoDelegate, OmnichainGovernanceExecutor } from 'libs/contracts';
import type { LooseEthersContractTxData } from 'types';

export interface ExecuteProposalInput {
  contract: GovernorBravoDelegate | OmnichainGovernanceExecutor;
  proposalId: number;
}

export type ExecuteProposalOutput = LooseEthersContractTxData;

const executeProposal = ({
  contract,
  proposalId,
}: ExecuteProposalInput): ExecuteProposalOutput => ({
  contract,
  methodName: 'execute',
  args: [proposalId],
});

export default executeProposal;
