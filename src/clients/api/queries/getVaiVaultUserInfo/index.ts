import { IGetVaiVaultUserInfoInput, IGetVaiVaultUserInfoOutput } from './types';
import formatToUserInfo from './formatToUserInfo';

export * from './types';

const getVaiVaultUserInfo = async ({
  vaiVaultContract,
  accountAddress,
}: IGetVaiVaultUserInfoInput): Promise<IGetVaiVaultUserInfoOutput> => {
  const res = await vaiVaultContract.methods.userInfo(accountAddress).call();
  return formatToUserInfo(res);
};

export default getVaiVaultUserInfo;
