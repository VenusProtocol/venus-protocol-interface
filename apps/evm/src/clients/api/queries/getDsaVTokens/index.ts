import { relativePositionManagerAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetDsaVTokensInput {
  publicClient: PublicClient;
  relativePositionManagerAddress: Address;
}

export type GetDsaVTokensOutput = {
  dsaVTokenAddresses: Address[];
};

export const getDsaVTokens = async ({
  publicClient,
  relativePositionManagerAddress,
}: GetDsaVTokensInput): Promise<GetDsaVTokensOutput> => {
  const dsaVTokenAddresses = await publicClient.readContract({
    address: relativePositionManagerAddress,
    abi: relativePositionManagerAbi,
    functionName: 'getDsaVTokens',
  });

  return {
    dsaVTokenAddresses: dsaVTokenAddresses as Address[],
  };
};
