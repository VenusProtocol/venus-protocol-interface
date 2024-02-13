import BigNumber from 'bignumber.js';
import { XvsVault } from 'libs/contracts';

export interface GetXvsVaultUserInfoInput {
  xvsVaultContract: XvsVault;
  rewardTokenAddress: string;
  poolIndex: number;
  accountAddress: string;
}

export interface GetXvsVaultUserInfoOutput {
  stakedAmountMantissa: BigNumber;
  pendingWithdrawalsTotalAmountMantissa: BigNumber;
  rewardDebtAmountMantissa: BigNumber;
}
