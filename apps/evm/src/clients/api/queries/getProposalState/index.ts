import { governorBravoDelegateAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetProposalStateInput {
  publicClient: PublicClient;
  proposalId: string;
  governorBravoDelegateAddress: Address;
}

export type GetProposalStateOutput = {
  state: number;
};

const getProposalState = async ({
  publicClient,
  proposalId,
  governorBravoDelegateAddress,
}: GetProposalStateInput): Promise<GetProposalStateOutput> => {
  const state = await publicClient.readContract({
    address: governorBravoDelegateAddress,
    abi: governorBravoDelegateAbi,
    functionName: 'state',
    args: [BigInt(proposalId)],
  });

  return { state };
};

export default getProposalState;
