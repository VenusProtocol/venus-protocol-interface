import BigNumber from 'bignumber.js';
import { XvsVault } from 'packages/contractsNew';

export interface GetXvsVaultUserInfoInput {
  xvsVaultContract: XvsVault;
  rewardTokenAddress: string;
  poolIndex: number;
  accountAddress: string;
}

export interface GetXvsVaultUserInfoOutput {
  stakedAmountWei: BigNumber;
  pendingWithdrawalsTotalAmountWei: BigNumber;
  rewardDebtAmountWei: BigNumber;
}
