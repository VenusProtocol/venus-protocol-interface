import BigNumber from 'bignumber.js';
import { XvsVault } from 'packages/contractsNew';

export interface GetXvsVaultPendingWithdrawalsFromBeforeUpgradeInput {
  xvsVaultContract: XvsVault;
  rewardTokenAddress: string;
  poolIndex: number;
  accountAddress: string;
}

export interface GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput {
  pendingWithdrawalsFromBeforeUpgradeWei: BigNumber;
}
