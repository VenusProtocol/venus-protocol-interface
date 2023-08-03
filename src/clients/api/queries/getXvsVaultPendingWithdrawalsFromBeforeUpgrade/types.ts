import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

export interface GetXvsVaultPendingWithdrawalsFromBeforeUpgradeInput {
  xvsVaultContract: ContractTypeByName<'xvsVault'>;
  rewardTokenAddress: string;
  poolIndex: number;
  accountAddress: string;
}

export interface GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput {
  pendingWithdrawalsFromBeforeUpgradeWei: BigNumber;
}
