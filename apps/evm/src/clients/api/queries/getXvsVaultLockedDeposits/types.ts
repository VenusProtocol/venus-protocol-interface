import { XvsVault } from 'packages/contracts';
import { LockedDeposit } from 'types';

export interface GetXvsVaultLockedDepositsInput {
  xvsVaultContract: XvsVault;
  rewardTokenAddress: string;
  poolIndex: number;
  accountAddress: string;
}

export type GetXvsVaultLockedDepositsOutput = {
  lockedDeposits: LockedDeposit[];
};
