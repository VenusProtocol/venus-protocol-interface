import BigNumber from 'bignumber.js';

import { IGetVaiVaultUserInfoInput, IGetVaiVaultUserInfoOutput } from './types';

export * from './types';

const getVaiVaultUserInfo = async ({
  vaiVaultContract,
  accountAddress,
}: IGetVaiVaultUserInfoInput): Promise<IGetVaiVaultUserInfoOutput> => {
  const res = await vaiVaultContract.methods.userInfo(accountAddress).call();

  return {
    stakedVaiWei: new BigNumber(res[0]),
  };
};

export default getVaiVaultUserInfo;
