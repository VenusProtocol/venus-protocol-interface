import { governorBravoDelegateAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetLatestProposalIdByProposerInput {
  publicClient: PublicClient;
  governorBravoDelegateContractAddress: Address;
  accountAddress: Address;
}

export type GetLatestProposalIdByProposerOutput = {
  proposalId: string;
};

export const getLatestProposalIdByProposer = async ({
  publicClient,
  governorBravoDelegateContractAddress,
  accountAddress,
}: GetLatestProposalIdByProposerInput): Promise<GetLatestProposalIdByProposerOutput> => {
  const res = await publicClient.readContract({
    address: governorBravoDelegateContractAddress,
    abi: governorBravoDelegateAbi,
    functionName: 'latestProposalIds',
    args: [accountAddress],
  });

  return {
    proposalId: res.toString(),
  };
};
