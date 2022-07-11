import { GovernorBravoDelegate } from 'types/contracts';
import { VoteSupport } from 'types';
import indexedVotingSupportNames from 'constants/indexedVotingSupportNames';

export interface IGetVoteReceiptInput {
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
}: IGetVoteReceiptInput): Promise<GetVoteReceiptOutput> => {
  const [hasVotes, support] = await governorBravoContract.methods
    .getReceipt(proposalId, accountAddress)
    .call();

  const voteSupport = hasVotes ? indexedVotingSupportNames[parseInt(support, 10)] : 'NOT_VOTED';

  return {
    voteSupport,
  };
};

export default getVoteReceipt;
