import type { GovernorBravoDelegate } from 'libs/contracts';
import type { LooseEthersContractTxData, VoteSupport } from 'types';

export interface CastVoteWithReasonInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
  proposalId: number;
  voteType: VoteSupport;
  voteReason: string;
}

export type CastVoteWithReasonOutput = LooseEthersContractTxData;

const castVoteWithReason = ({
  governorBravoDelegateContract,
  proposalId,
  voteType,
  voteReason,
}: CastVoteWithReasonInput): CastVoteWithReasonOutput => ({
  contract: governorBravoDelegateContract,
  methodName: 'castVoteWithReason',
  args: [proposalId, voteType, voteReason],
});

export default castVoteWithReason;
