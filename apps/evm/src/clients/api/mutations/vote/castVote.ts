import type { GovernorBravoDelegate } from 'libs/contracts';
import type { LooseEthersContractTxData } from 'types';

export interface CastVoteInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
  proposalId: number;
  voteType: 0 | 1 | 2;
}

export type CastVoteOutput = LooseEthersContractTxData;

const castVote = ({
  governorBravoDelegateContract,
  proposalId,
  voteType,
}: CastVoteInput): CastVoteOutput => ({
  contract: governorBravoDelegateContract,
  methodName: 'castVote',
  args: [proposalId, voteType],
});

export default castVote;
