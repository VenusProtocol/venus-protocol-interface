import type { XvsVault } from 'libs/contracts';

export interface GetXvsVaultTotalAllocPointsInput {
  xvsVaultContract: XvsVault;
  tokenAddress: string;
}

export type GetXvsVaultTotalAllocPointsOutput = {
  totalAllocationPoints: number;
};

export const getXvsVaultTotalAllocationPoints = async ({
  xvsVaultContract,
  tokenAddress,
}: GetXvsVaultTotalAllocPointsInput): Promise<GetXvsVaultTotalAllocPointsOutput> => {
  const res = await xvsVaultContract.totalAllocPoints(tokenAddress);

  return {
    totalAllocationPoints: res.toNumber(),
  };
};
