import { GovernorBravoDelegate } from 'types/contracts';

export interface IGetVoteReceiptInput {
  governorBravoContract: GovernorBravoDelegate;
  proposalId: number;
  accountAddress: string;
}

// support value for voter (0 against, 1 for, 2 abstain)
const VoteSupport = {
  0: 'AGAINST',
  1: 'FOR',
  2: 'ABSTAIN',
};

export type GetVoteReceiptOutput = 'AGAINST' | 'FOR' | 'ABSTAIN' | undefined;

const getVoteReceipt = async ({
  governorBravoContract,
  proposalId,
  accountAddress,
}: IGetVoteReceiptInput): Promise<GetVoteReceiptOutput> => {
  const [hasVotes, support] = await governorBravoContract.methods
    .getReceipt(proposalId, accountAddress)
    .call();
  return hasVotes
    ? (VoteSupport[support as '0' | '1' | '2'] as 'AGAINST' | 'FOR' | 'ABSTAIN')
    : undefined;
};

export default getVoteReceipt;
