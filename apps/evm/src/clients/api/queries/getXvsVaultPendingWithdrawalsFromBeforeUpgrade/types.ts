import type BigNumber from 'bignumber.js';

import type { XvsVault } from 'libs/contracts';

export interface GetXvsVaultPendingWithdrawalsFromBeforeUpgradeInput {
  xvsVaultContract: XvsVault;
  rewardTokenAddress: string;
  poolIndex: number;
  accountAddress: string;
}

export interface GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput {
  pendingWithdrawalsFromBeforeUpgradeMantissa: BigNumber;
}
