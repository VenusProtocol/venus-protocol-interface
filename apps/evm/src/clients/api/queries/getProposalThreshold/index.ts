import BigNumber from 'bignumber.js';
import { governorBravoDelegateAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetProposalThresholdInput {
  publicClient: PublicClient;
  governorBravoDelegateAddress: Address;
}

export type GetProposalThresholdOutput = {
  thresholdMantissa: BigNumber;
};

export const getProposalThreshold = async ({
  publicClient,
  governorBravoDelegateAddress,
}: GetProposalThresholdInput): Promise<GetProposalThresholdOutput> => {
  const threshold = await publicClient.readContract({
    address: governorBravoDelegateAddress,
    abi: governorBravoDelegateAbi,
    functionName: 'proposalThreshold',
  });

  return {
    thresholdMantissa: new BigNumber(threshold.toString()),
  };
};
