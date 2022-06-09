import { IGetXvsVaultUserInfoInput, IGetXvsVaultUserInfoOutput } from './types';
import formatToUserInfo from './formatToUserInfo';

export * from './types';

const GetXvsVaultUserInfo = async ({
  xvsVaultContract,
  tokenAddress,
  poolIndex,
  accountAddress,
}: IGetXvsVaultUserInfoInput): Promise<IGetXvsVaultUserInfoOutput> => {
  const res = await xvsVaultContract.methods
    .getUserInfo(tokenAddress, poolIndex, accountAddress)
    .call();

  return formatToUserInfo(res);
};

export default GetXvsVaultUserInfo;
