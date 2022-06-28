import type { TransactionReceipt } from 'web3-core/types';

import { GovernorBravoDelegate } from 'types/contracts';

export interface HookParams {
  governorBravoContract: GovernorBravoDelegate;
  fromAccountAddress: string;
}

export interface ICastVoteWithReasonInput {
  proposalId: number;
  voteType: 0 | 1 | 2;
  voteReason: string;
}

export type CastVoteWithReasonOutput = TransactionReceipt;

const castVoteWithReason = async ({
  governorBravoContract,
  fromAccountAddress,
  proposalId,
  voteType,
  voteReason,
}: ICastVoteWithReasonInput & HookParams): Promise<CastVoteWithReasonOutput> =>
  governorBravoContract.methods
    .castVoteWithReason(proposalId, voteType, voteReason)
    .send({ from: fromAccountAddress });

export default castVoteWithReason;
