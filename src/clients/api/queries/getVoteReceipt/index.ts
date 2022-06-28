import { getContractAddress, getSupportName } from 'utilities';
import { GovernorBravoDelegate } from 'types/contracts';
import { VoteSupport } from 'types';

export interface IGetVoteReceiptInput {
  governorBravoContract: GovernorBravoDelegate;
  proposalId: number;
  accountAddress: string;
}

export interface IGetVoteReceiptOutput {
  hasVoted: boolean;
  vote: VoteSupport;
}

const getVoteReceipt = async ({
  governorBravoContract,
  accountAddress,
}: IGetVoteReceiptInput): Promise<IGetVoteReceiptOutput> => {
  const [hasVotes, support] = await governorBravoContract.methods
    .getReceipt(accountAddress, getContractAddress('comptroller'))
    .call();
  return {
    hasVoted: hasVotes,
    vote: getSupportName(parseInt(support, 10) as 0 | 1 | 2),
  };
};

export default getVoteReceipt;
