import { getContractAddress } from 'utilities';
import { GovernorBravoDelegate } from 'types/contracts';

export interface IGetVoteReceiptInput {
  governorBravoContract: GovernorBravoDelegate;
  proposalId: string;
  accountAddress: string;
}

// support value for voter (0 against, 1 for, 2 abstain)
const VoteSupport = {
  0: 'against',
  1: 'for',
  2: 'abstain',
};

export interface IGetVoteReceiptOutput {
  hasVoted: boolean;
  vote: typeof VoteSupport[keyof typeof VoteSupport] | undefined;
}

const getXvsReward = async ({
  governorBravoContract,
  accountAddress,
}: IGetVoteReceiptInput): Promise<IGetVoteReceiptOutput> => {
  const [hasVotes, support] = await governorBravoContract.methods
    .getReceipt(accountAddress, getContractAddress('comptroller'))
    .call();
  return {
    hasVoted: hasVotes,
    vote: VoteSupport[support as '0' | '1' | '2'],
  };
};

export default getXvsReward;
