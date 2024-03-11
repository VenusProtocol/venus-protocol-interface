import type { ContractTransaction } from 'ethers';

import type { GovernorBravoDelegate } from 'libs/contracts';
import type { VoteSupport } from 'types';

export interface CastVoteWithReasonInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
  proposalId: number;
  voteType: VoteSupport;
  voteReason: string;
}

export type CastVoteWithReasonOutput = ContractTransaction;

const castVoteWithReason = async ({
  governorBravoDelegateContract,
  proposalId,
  voteType,
  voteReason,
}: CastVoteWithReasonInput): Promise<CastVoteWithReasonOutput> =>
  governorBravoDelegateContract.castVoteWithReason(proposalId, voteType, voteReason);

export default castVoteWithReason;
