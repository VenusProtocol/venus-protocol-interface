import { TOKENS } from 'constants/tokens';
import { XvsVault } from 'types/contracts';

export interface GetXvsVaultPoolCountInput {
  xvsVaultContract: XvsVault;
}

export type GetXvsVaultPoolCountOutput = {
  poolCount: number;
};

const getXvsVaultPoolCount = async ({
  xvsVaultContract,
}: GetXvsVaultPoolCountInput): Promise<GetXvsVaultPoolCountOutput> => {
  const xvsTokenAddress = TOKENS.xvs.address;
  const xvsVaultPoolLength = await xvsVaultContract.methods.poolLength(xvsTokenAddress).call();

  return {
    poolCount: +xvsVaultPoolLength,
  };
};

export default getXvsVaultPoolCount;
