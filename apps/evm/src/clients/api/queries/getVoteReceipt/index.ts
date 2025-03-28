import { governorBravoDelegateAbi } from 'libs/contracts';
import type { VoteSupport } from 'types';
import type { Address, PublicClient } from 'viem';

export interface GetVoteReceiptInput {
  publicClient: PublicClient;
  governorBravoDelegateAddress: Address;
  proposalId: number;
  accountAddress: Address;
}

export type GetVoteReceiptOutput = {
  voteSupport: VoteSupport | undefined;
};

export const getVoteReceipt = async ({
  proposalId,
  publicClient,
  governorBravoDelegateAddress,
  accountAddress,
}: GetVoteReceiptInput): Promise<GetVoteReceiptOutput> => {
  const receipt = await publicClient.readContract({
    address: governorBravoDelegateAddress,
    abi: governorBravoDelegateAbi,
    functionName: 'getReceipt',
    args: [BigInt(proposalId), accountAddress],
  });

  const voteSupport = receipt.hasVoted ? (receipt.support as VoteSupport) : undefined;

  return {
    voteSupport,
  };
};
