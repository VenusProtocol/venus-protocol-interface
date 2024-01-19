import { XvsVault } from 'packages/contracts';

export interface GetXvsVaultPausedInput {
  xvsVaultContract: XvsVault;
}

export type GetXvsVaultPausedOutput = {
  isVaultPaused: boolean;
};

export const getXvsVaultPaused = async ({
  xvsVaultContract,
}: GetXvsVaultPausedInput): Promise<GetXvsVaultPausedOutput> => {
  const isVaultPaused = await xvsVaultContract.vaultPaused();

  return {
    isVaultPaused,
  };
};
