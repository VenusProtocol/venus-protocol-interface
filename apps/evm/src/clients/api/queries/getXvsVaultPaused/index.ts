import { xvsVaultAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetXvsVaultPausedInput {
  publicClient: PublicClient;
  xvsVaultContractAddress: Address;
}

export type GetXvsVaultPausedOutput = {
  isVaultPaused: boolean;
};

export const getXvsVaultPaused = async ({
  publicClient,
  xvsVaultContractAddress,
}: GetXvsVaultPausedInput): Promise<GetXvsVaultPausedOutput> => {
  const isVaultPaused = await publicClient.readContract({
    address: xvsVaultContractAddress,
    abi: xvsVaultAbi,
    functionName: 'vaultPaused',
  });

  return {
    isVaultPaused,
  };
};
