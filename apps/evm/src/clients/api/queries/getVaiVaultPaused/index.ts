import { vaiVaultAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetVaiVaultPausedInput {
  publicClient: PublicClient;
  vaiVaultAddress: Address;
}

export type GetVaiVaultPausedOutput = {
  isVaultPaused: boolean;
};

export const getVaiVaultPaused = async ({
  publicClient,
  vaiVaultAddress,
}: GetVaiVaultPausedInput): Promise<GetVaiVaultPausedOutput> => {
  const isVaultPaused = await publicClient.readContract({
    address: vaiVaultAddress,
    abi: vaiVaultAbi,
    functionName: 'vaultPaused',
  });

  return {
    isVaultPaused,
  };
};
