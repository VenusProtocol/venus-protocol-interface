import type { GovernorBravoDelegate } from 'libs/contracts';
import type { ContractTxData } from 'types';

export interface CastVoteInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
  proposalId: number;
  voteType: 0 | 1 | 2;
}

export type CastVoteOutput = ContractTxData<GovernorBravoDelegate, 'castVote'>;

const castVote = async ({
  governorBravoDelegateContract,
  proposalId,
  voteType,
}: CastVoteInput): Promise<CastVoteOutput> => ({
  contract: governorBravoDelegateContract,
  methodName: 'castVote',
  args: [proposalId, voteType],
});

export default castVote;
