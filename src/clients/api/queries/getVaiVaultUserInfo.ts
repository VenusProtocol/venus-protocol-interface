import BigNumber from 'bignumber.js';
import { VaiVault } from 'types/contracts';

export interface IGetVaiVaultUserInfoInput {
  vaiVaultContract: VaiVault;
  accountAddress: string;
}

export type GetVaiVaultUserInfoOutput = {
  stakedVaiWei: BigNumber;
};

const getVaiVaultUserInfo = async ({
  vaiVaultContract,
  accountAddress,
}: IGetVaiVaultUserInfoInput): Promise<GetVaiVaultUserInfoOutput> => {
  const res = await vaiVaultContract.methods.userInfo(accountAddress).call();

  return {
    stakedVaiWei: new BigNumber(res[0]),
  };
};

export default getVaiVaultUserInfo;
