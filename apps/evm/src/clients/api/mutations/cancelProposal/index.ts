import type { GovernorBravoDelegate } from 'libs/contracts';
import type { ContractTxData } from 'types';

export interface CancelProposalInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
  proposalId: number;
}

export type CancelProposalOutput = ContractTxData<GovernorBravoDelegate, 'cancel'>;

const cancelProposal = ({
  governorBravoDelegateContract,
  proposalId,
}: CancelProposalInput): CancelProposalOutput => ({
  contract: governorBravoDelegateContract,
  methodName: 'cancel',
  args: [proposalId],
});

export default cancelProposal;
