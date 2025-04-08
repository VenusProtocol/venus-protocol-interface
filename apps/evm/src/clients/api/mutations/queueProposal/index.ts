import type { GovernorBravoDelegate } from 'libs/contracts';
import type { LooseEthersContractTxData } from 'types';

export interface QueueProposalInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
  proposalId: number;
}

export type QueueProposalOutput = LooseEthersContractTxData;

const queueProposal = ({
  governorBravoDelegateContract,
  proposalId,
}: QueueProposalInput): QueueProposalOutput => ({
  contract: governorBravoDelegateContract,
  methodName: 'queue',
  args: [proposalId],
});

export default queueProposal;
