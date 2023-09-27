import { ContractTypeByName } from 'packages/contracts';
import { VoteSupport } from 'types';

export interface GetVoteReceiptInput {
  governorBravoDelegateContract: ContractTypeByName<'governorBravoDelegate'>;
  proposalId: number;
  accountAddress: string;
}

export type GetVoteReceiptOutput = {
  voteSupport: VoteSupport | undefined;
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
  const voteSupport = hasVotes ? support : undefined;

  return {
    voteSupport,
  };
};

export default getVoteReceipt;
