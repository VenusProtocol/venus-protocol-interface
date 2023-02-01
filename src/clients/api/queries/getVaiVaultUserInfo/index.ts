import formatToUserInfo from './formatToUserInfo';
import { GetVaiVaultUserInfoInput, GetVaiVaultUserInfoOutput } from './types';

export * from './types';

const getVaiVaultUserInfo = async ({
  vaiVaultContract,
  accountAddress,
}: GetVaiVaultUserInfoInput): Promise<GetVaiVaultUserInfoOutput> => {
  const res = await vaiVaultContract.userInfo(accountAddress);
  return formatToUserInfo(res);
};

export default getVaiVaultUserInfo;
