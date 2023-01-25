import { VoteSupport } from 'types';

import indexedVotingSupportNames from 'constants/indexedVotingSupportNames';
import { GovernorBravoDelegate } from 'types/contracts';

export interface GetVoteReceiptInput {
  governorBravoContract: GovernorBravoDelegate;
  proposalId: number;
  accountAddress: string;
}

export type GetVoteReceiptOutput = {
  voteSupport: VoteSupport;
};

const getVoteReceipt = async ({
  proposalId,
  governorBravoContract,
  accountAddress,
}: GetVoteReceiptInput): Promise<GetVoteReceiptOutput> => {
  const [hasVotes, support] = await governorBravoContract.getReceipt(proposalId, accountAddress);
  const voteSupport = hasVotes ? indexedVotingSupportNames[support] : 'NOT_VOTED';

  return {
    voteSupport,
  };
};

export default getVoteReceipt;
