import { XvsVault } from 'packages/contractsNew';

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
