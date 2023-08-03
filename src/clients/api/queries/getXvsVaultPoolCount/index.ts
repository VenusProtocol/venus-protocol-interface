import { ContractTypeByName } from 'packages/contracts';

import { TOKENS } from 'constants/tokens';

export interface GetXvsVaultPoolCountInput {
  xvsVaultContract: ContractTypeByName<'xvsVault'>;
}

export type GetXvsVaultPoolCountOutput = {
  poolCount: number;
};

const getXvsVaultPoolCount = async ({
  xvsVaultContract,
}: GetXvsVaultPoolCountInput): Promise<GetXvsVaultPoolCountOutput> => {
  const xvsTokenAddress = TOKENS.xvs.address;
  const xvsVaultPoolLength = await xvsVaultContract.poolLength(xvsTokenAddress);

  return {
    poolCount: xvsVaultPoolLength.toNumber(),
  };
};

export default getXvsVaultPoolCount;
