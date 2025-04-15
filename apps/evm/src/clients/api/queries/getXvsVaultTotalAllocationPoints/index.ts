import { xvsVaultAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetXvsVaultTotalAllocPointsInput {
  publicClient: PublicClient;
  xvsVaultContractAddress: Address;
  tokenAddress: Address;
}

export type GetXvsVaultTotalAllocPointsOutput = {
  totalAllocationPoints: number;
};

export const getXvsVaultTotalAllocationPoints = async ({
  publicClient,
  xvsVaultContractAddress,
  tokenAddress,
}: GetXvsVaultTotalAllocPointsInput): Promise<GetXvsVaultTotalAllocPointsOutput> => {
  const res = await publicClient.readContract({
    address: xvsVaultContractAddress,
    abi: xvsVaultAbi,
    functionName: 'totalAllocPoints',
    args: [tokenAddress],
  });

  return {
    totalAllocationPoints: Number(res),
  };
};
