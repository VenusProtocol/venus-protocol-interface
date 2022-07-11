import { IGetXvsVaultUserInfoInput, IGetXvsVaultUserInfoOutput } from './types';
import formatToUserInfo from './formatToUserInfo';

export * from './types';

const getXvsVaultUserInfo = async ({
  xvsVaultContract,
  rewardTokenAddress,
  poolIndex,
  accountAddress,
}: IGetXvsVaultUserInfoInput): Promise<IGetXvsVaultUserInfoOutput> => {
  const res = await xvsVaultContract.methods
    .getUserInfo(rewardTokenAddress, poolIndex, accountAddress)
    .call();

  return formatToUserInfo(res);
};

export default getXvsVaultUserInfo;
