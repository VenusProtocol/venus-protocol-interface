import formatToUserInfo from './formatToUserInfo';
import { IGetVrtVaultUserInfoInput, IGetVrtVaultUserInfoOutput } from './types';

export * from './types';

const getVrtVaultUserInfo = async ({
  vrtVaultContract,
  accountAddress,
}: IGetVrtVaultUserInfoInput): Promise<IGetVrtVaultUserInfoOutput> => {
  const res = await vrtVaultContract.methods.userInfo(accountAddress).call();
  return formatToUserInfo(res);
};

export default getVrtVaultUserInfo;
