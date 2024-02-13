import BigNumber from 'bignumber.js';

import { XvsVault } from 'libs/contracts';

export interface GetXvsVaultPendingWithdrawalsFromBeforeUpgradeInput {
  xvsVaultContract: XvsVault;
  rewardTokenAddress: string;
  poolIndex: number;
  accountAddress: string;
}

export interface GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput {
  pendingWithdrawalsFromBeforeUpgradeMantissa: BigNumber;
}
