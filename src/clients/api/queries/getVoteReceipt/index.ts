import { GovernorBravoDelegate } from 'packages/contractsNew';
import { VoteSupport } from 'types';

import indexedVotingSupportNames from 'constants/indexedVotingSupportNames';

export interface GetVoteReceiptInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
  proposalId: number;
  accountAddress: string;
}

export type GetVoteReceiptOutput = {
  voteSupport: VoteSupport;
};

const getVoteReceipt = async ({
  proposalId,
  governorBravoDelegateContract,
  accountAddress,
}: GetVoteReceiptInput): Promise<GetVoteReceiptOutput> => {
  const [hasVotes, support] = await governorBravoDelegateContract.getReceipt(
    proposalId,
    accountAddress,
  );
  const voteSupport = hasVotes ? indexedVotingSupportNames[support] : 'NOT_VOTED';

  return {
    voteSupport,
  };
};

export default getVoteReceipt;
