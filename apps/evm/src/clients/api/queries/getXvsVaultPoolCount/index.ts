import { xvsVaultAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetXvsVaultPoolCountInput {
  xvsTokenAddress: Address;
  xvsVaultContractAddress: Address;
  publicClient: PublicClient;
}

export type GetXvsVaultPoolCountOutput = {
  poolCount: number;
};

export const getXvsVaultPoolCount = async ({
  xvsTokenAddress,
  xvsVaultContractAddress,
  publicClient,
}: GetXvsVaultPoolCountInput): Promise<GetXvsVaultPoolCountOutput> => {
  const xvsVaultPoolLength = await publicClient.readContract({
    address: xvsVaultContractAddress,
    abi: xvsVaultAbi,
    functionName: 'poolLength',
    args: [xvsTokenAddress],
  });

  return {
    poolCount: Number(xvsVaultPoolLength),
  };
};
