import formatToUserInfo from './formatToUserInfo';
import { GetVrtVaultUserInfoInput, GetVrtVaultUserInfoOutput } from './types';

export * from './types';

const getVrtVaultUserInfo = async ({
  vrtVaultContract,
  accountAddress,
}: GetVrtVaultUserInfoInput): Promise<GetVrtVaultUserInfoOutput> => {
  const res = await vrtVaultContract.methods.userInfo(accountAddress).call();
  return formatToUserInfo(res);
};

export default getVrtVaultUserInfo;
