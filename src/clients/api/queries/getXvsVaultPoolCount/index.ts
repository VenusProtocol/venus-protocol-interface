import { ContractTypeByName } from 'packages/contracts';

export interface GetXvsVaultPoolCountInput {
  xvsTokenAddress: string;
  xvsVaultContract: ContractTypeByName<'xvsVault'>;
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
