import formatToUserInfo from './formatToUserInfo';
import { GetVrtVaultUserInfoInput, GetVrtVaultUserInfoOutput } from './types';

export * from './types';

const getVrtVaultUserInfo = async ({
  vrtVaultContract,
  accountAddress,
}: GetVrtVaultUserInfoInput): Promise<GetVrtVaultUserInfoOutput> => {
  const res = await vrtVaultContract.userInfo(accountAddress);
  return formatToUserInfo(res);
};

export default getVrtVaultUserInfo;
