import BigNumber from 'bignumber.js';

import { XvsVault } from 'packages/contracts';

export interface GetXvsVaultPoolInfoInput {
  xvsVaultContract: XvsVault;
  rewardTokenAddress: string;
  poolIndex: number;
}

export interface GetXvsVaultPoolInfoOutput {
  stakedTokenAddress: string;
  allocationPoint: number;
  lastRewardBlock: number;
  accRewardPerShare: BigNumber;
  lockingPeriodMs: number;
}
