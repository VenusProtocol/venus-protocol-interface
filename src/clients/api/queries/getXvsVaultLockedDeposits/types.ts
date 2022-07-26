import { LockedDeposit } from 'types';

import { XvsVault } from 'types/contracts';

export interface GetXvsVaultLockedDepositsInput {
  xvsVaultContract: XvsVault;
  rewardTokenAddress: string;
  poolIndex: number;
  accountAddress: string;
}

export type GetXvsVaultLockedDepositsOutput = {
  lockedDeposits: LockedDeposit[];
};
