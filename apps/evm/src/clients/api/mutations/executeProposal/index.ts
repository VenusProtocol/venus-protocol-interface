import type { ContractTransaction } from 'ethers';

import type { GovernorBravoDelegate, OmnichainGovernanceExecutor } from 'libs/contracts';

export interface ExecuteProposalInput {
  contract: GovernorBravoDelegate | OmnichainGovernanceExecutor;
  proposalId: number;
}

export type ExecuteProposalOutput = ContractTransaction;

const executeProposal = async ({
  contract,
  proposalId,
}: ExecuteProposalInput): Promise<ExecuteProposalOutput> => contract.execute(proposalId);

export default executeProposal;
