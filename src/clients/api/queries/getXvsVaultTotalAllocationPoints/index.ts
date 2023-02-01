import { XvsVault } from 'types/contracts';

export interface GetXvsVaultTotalAllocPointsInput {
  xvsVaultContract: XvsVault;
  tokenAddress: string;
}

export type GetXvsVaultTotalAllocPointsOutput = {
  totalAllocationPoints: number;
};

const getXvsVaultTotalAllocationPoints = async ({
  xvsVaultContract,
  tokenAddress,
}: GetXvsVaultTotalAllocPointsInput): Promise<GetXvsVaultTotalAllocPointsOutput> => {
  const res = await xvsVaultContract.totalAllocPoints(tokenAddress);

  return {
    totalAllocationPoints: res.toNumber(),
  };
};

export default getXvsVaultTotalAllocationPoints;
