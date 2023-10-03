import { XvsVault } from 'packages/contracts';

export interface GetXvsVaultPoolCountInput {
  xvsTokenAddress: string;
  xvsVaultContract: XvsVault;
}

export type GetXvsVaultPoolCountOutput = {
  poolCount: number;
};

const getXvsVaultPoolCount = async ({
  xvsTokenAddress,
  xvsVaultContract,
}: GetXvsVaultPoolCountInput): Promise<GetXvsVaultPoolCountOutput> => {
  const xvsVaultPoolLength = await xvsVaultContract.poolLength(xvsTokenAddress);

  return {
    poolCount: xvsVaultPoolLength.toNumber(),
  };
};

export default getXvsVaultPoolCount;
