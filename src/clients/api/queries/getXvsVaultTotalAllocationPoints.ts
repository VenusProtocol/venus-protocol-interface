import { XvsVault } from 'types/contracts';

export interface IGetXvsVaultTotalAllocPointsInput {
  xvsVaultContract: XvsVault;
  tokenAddress: string;
}

export type GetXvsVaultTotalAllocPointsOutput = number;

const getXvsVaultTotalAllocationPoints = async ({
  xvsVaultContract,
  tokenAddress,
}: IGetXvsVaultTotalAllocPointsInput): Promise<GetXvsVaultTotalAllocPointsOutput> => {
  const res = await xvsVaultContract.methods.totalAllocPoints(tokenAddress).call();
  return +res;
};

export default getXvsVaultTotalAllocationPoints;
