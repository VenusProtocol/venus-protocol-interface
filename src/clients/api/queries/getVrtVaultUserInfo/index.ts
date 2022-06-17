import { IGetVrtVaultUserInfoInput, IGetVrtVaultUserInfoOutput } from './types';
import formatToUserInfo from './formatToUserInfo';

export * from './types';

const getVrtVaultUserInfo = async ({
  vrtVaultContract,
  accountAddress,
}: IGetVrtVaultUserInfoInput): Promise<IGetVrtVaultUserInfoOutput> => {
  const res = await vrtVaultContract.methods.userInfo(accountAddress).call();
  return formatToUserInfo(res);
};

export default getVrtVaultUserInfo;
