import type { GovernorBravoDelegate } from 'libs/contracts';
import type { ContractTxData } from 'types';

export interface QueueProposalInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
  proposalId: number;
}

export type QueueProposalOutput = ContractTxData<GovernorBravoDelegate, 'queue'>;

const queueProposal = async ({
  governorBravoDelegateContract,
  proposalId,
}: QueueProposalInput): Promise<QueueProposalOutput> => ({
  contract: governorBravoDelegateContract,
  methodName: 'queue',
  args: [proposalId],
});

export default queueProposal;
