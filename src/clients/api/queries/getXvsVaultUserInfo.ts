import BigNumber from 'bignumber.js';

import { XvsVault } from 'types/contracts';

export interface IGetXvsVaultUserInfoInput {
  xvsVaultContract: XvsVault;
  tokenAddress: string;
  poolIndex: number;
  accountAddress: string;
}

export interface IGetXvsVaultUserInfoOutput {
  stakedAmountWei: BigNumber;
  pendingWithdrawalsTotalAmountWei: BigNumber;
  rewardDebtAmountWei: BigNumber;
}

const GetXvsVaultUserInfo = async ({
  xvsVaultContract,
  tokenAddress,
  poolIndex,
  accountAddress,
}: IGetXvsVaultUserInfoInput): Promise<IGetXvsVaultUserInfoOutput> => {
  const res = await xvsVaultContract.methods
    .getUserInfo(tokenAddress, poolIndex, accountAddress)
    .call();

  return {
    stakedAmountWei: new BigNumber(res.amount),
    pendingWithdrawalsTotalAmountWei: new BigNumber(res.pendingWithdrawals),
    rewardDebtAmountWei: new BigNumber(res.rewardDebt),
  };
};

export default GetXvsVaultUserInfo;
