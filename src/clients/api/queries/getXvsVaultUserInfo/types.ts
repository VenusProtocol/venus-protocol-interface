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
