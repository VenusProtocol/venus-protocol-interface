import formatToUserInfo from './formatToUserInfo';
import { GetXvsVaultUserInfoInput, GetXvsVaultUserInfoOutput } from './types';

export * from './types';

const getXvsVaultUserInfo = async ({
  xvsVaultContract,
  rewardTokenAddress,
  poolIndex,
  accountAddress,
}: GetXvsVaultUserInfoInput): Promise<GetXvsVaultUserInfoOutput> => {
  const res = await xvsVaultContract.getUserInfo(rewardTokenAddress, poolIndex, accountAddress);
  return formatToUserInfo(res);
};

export default getXvsVaultUserInfo;
