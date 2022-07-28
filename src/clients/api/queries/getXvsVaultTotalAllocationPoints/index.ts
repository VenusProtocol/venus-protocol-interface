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
  const res = await xvsVaultContract.methods.totalAllocPoints(tokenAddress).call();

  return {
    totalAllocationPoints: +res,
  };
};

export default getXvsVaultTotalAllocationPoints;
