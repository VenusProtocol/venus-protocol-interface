import BigNumber from 'bignumber.js';

import { XvsVault } from 'types/contracts';

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
