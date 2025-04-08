import type { GovernorBravoDelegate } from 'libs/contracts';
import type { LooseEthersContractTxData } from 'types';

export interface CancelProposalInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
  proposalId: number;
}

export type CancelProposalOutput = LooseEthersContractTxData;

const cancelProposal = ({
  governorBravoDelegateContract,
  proposalId,
}: CancelProposalInput): CancelProposalOutput => ({
  contract: governorBravoDelegateContract,
  methodName: 'cancel',
  args: [proposalId],
});

export default cancelProposal;
