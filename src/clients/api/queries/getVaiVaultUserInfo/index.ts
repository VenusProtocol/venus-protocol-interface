import formatToUserInfo from './formatToUserInfo';
import { IGetVaiVaultUserInfoInput, IGetVaiVaultUserInfoOutput } from './types';

export * from './types';

const getVaiVaultUserInfo = async ({
  vaiVaultContract,
  accountAddress,
}: IGetVaiVaultUserInfoInput): Promise<IGetVaiVaultUserInfoOutput> => {
  const res = await vaiVaultContract.methods.userInfo(accountAddress).call();
  return formatToUserInfo(res);
};

export default getVaiVaultUserInfo;
