import { VaiVault } from 'libs/contracts';

export interface GetVaiVaultPausedInput {
  vaiVaultContract: VaiVault;
}

export type GetVaiVaultPausedOutput = {
  isVaultPaused: boolean;
};

export const getVaiVaultPaused = async ({
  vaiVaultContract,
}: GetVaiVaultPausedInput): Promise<GetVaiVaultPausedOutput> => {
  const isVaultPaused = await vaiVaultContract.vaultPaused();

  return {
    isVaultPaused,
  };
};
