import formatToPoolInfo from './formatToPoolInfo';
import type { GetXvsVaultPoolInfoInput, GetXvsVaultPoolInfoOutput } from './types';

export * from './types';

export const getXvsVaultPoolInfo = async ({
  xvsVaultContract,
  rewardTokenAddress,
  poolIndex,
}: GetXvsVaultPoolInfoInput): Promise<GetXvsVaultPoolInfoOutput> => {
  const res = await xvsVaultContract.poolInfos(rewardTokenAddress, poolIndex);
  return formatToPoolInfo(res);
};
