import formatToUserInfo from './formatToUserInfo';
import { GetXvsVaultUserInfoInput, GetXvsVaultUserInfoOutput } from './types';

export * from './types';

const getXvsVaultUserInfo = async ({
  xvsVaultContract,
  rewardTokenAddress,
  poolIndex,
  accountAddress,
}: GetXvsVaultUserInfoInput): Promise<GetXvsVaultUserInfoOutput> => {
  const res = await xvsVaultContract.methods
    .getUserInfo(rewardTokenAddress, poolIndex, accountAddress)
    .call();

  return formatToUserInfo(res);
};

export default getXvsVaultUserInfo;
