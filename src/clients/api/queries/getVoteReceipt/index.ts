import { ContractTypeByName } from 'packages/contracts';
import { VoteSupport } from 'types';

import indexedVotingSupportNames from 'constants/indexedVotingSupportNames';

export interface GetVoteReceiptInput {
  governorBravoContract: ContractTypeByName<'governorBravoDelegate'>;
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
