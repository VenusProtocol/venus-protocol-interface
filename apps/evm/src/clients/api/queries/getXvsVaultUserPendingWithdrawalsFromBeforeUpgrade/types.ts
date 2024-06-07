import type BigNumber from 'bignumber.js';

import type { XvsVault } from 'libs/contracts';

export interface GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeInput {
  xvsVaultContract: XvsVault;
  rewardTokenAddress: string;
  poolIndex: number;
  accountAddress: string;
}

export interface GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeOutput {
  userPendingWithdrawalsFromBeforeUpgradeMantissa: BigNumber;
}
