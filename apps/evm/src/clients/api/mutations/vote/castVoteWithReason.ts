import type { GovernorBravoDelegate } from 'libs/contracts';
import type { ContractTxData, VoteSupport } from 'types';

export interface CastVoteWithReasonInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
  proposalId: number;
  voteType: VoteSupport;
  voteReason: string;
}

export type CastVoteWithReasonOutput = ContractTxData<GovernorBravoDelegate, 'castVoteWithReason'>;

const castVoteWithReason = async ({
  governorBravoDelegateContract,
  proposalId,
  voteType,
  voteReason,
}: CastVoteWithReasonInput): Promise<CastVoteWithReasonOutput> => ({
  contract: governorBravoDelegateContract,
  methodName: 'castVoteWithReason',
  args: [proposalId, voteType, voteReason],
});

export default castVoteWithReason;
