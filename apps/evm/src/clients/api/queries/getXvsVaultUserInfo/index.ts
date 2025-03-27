import formatToUserInfo from './formatToUserInfo';
import type { GetXvsVaultUserInfoInput, GetXvsVaultUserInfoOutput } from './types';

export * from './types';

export const getXvsVaultUserInfo = async ({
  xvsVaultContract,
  rewardTokenAddress,
  poolIndex,
  accountAddress,
}: GetXvsVaultUserInfoInput): Promise<GetXvsVaultUserInfoOutput> => {
  const res = await xvsVaultContract.getUserInfo(rewardTokenAddress, poolIndex, accountAddress);
  return formatToUserInfo(res);
};
