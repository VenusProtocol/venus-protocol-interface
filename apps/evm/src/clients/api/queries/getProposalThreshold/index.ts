import BigNumber from 'bignumber.js';
import { governorBravoDelegateAbi } from 'libs/contracts';
import type { ProposalType } from 'types';
import type { Address, PublicClient } from 'viem';

export interface GetProposalThresholdInput {
  publicClient: PublicClient;
  governorBravoDelegateAddress: Address;
  proposalType: ProposalType;
}

export type GetProposalThresholdOutput = {
  thresholdMantissa: BigNumber;
};

export const getProposalThreshold = async ({
  publicClient,
  governorBravoDelegateAddress,
  proposalType,
}: GetProposalThresholdInput): Promise<GetProposalThresholdOutput> => {
  const [, , threshold] = await publicClient.readContract({
    address: governorBravoDelegateAddress,
    abi: governorBravoDelegateAbi,
    functionName: 'proposalConfigs',
    args: [BigInt(proposalType)],
  });

  return {
    thresholdMantissa: new BigNumber(threshold.toString()),
  };
};
