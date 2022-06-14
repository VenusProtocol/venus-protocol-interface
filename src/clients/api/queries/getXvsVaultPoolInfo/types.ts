import BigNumber from 'bignumber.js';

import { XvsVault } from 'types/contracts';

export interface IGetXvsVaultPoolInfoInput {
  xvsVaultContract: XvsVault;
  tokenAddress: string;
  poolIndex: number;
}

export interface IGetXvsVaultPoolInfoOutput {
  stakedTokenAddress: string;
  allocationPoint: number;
  lastRewardBlock: number;
  accRewardPerShare: BigNumber;
  lockingPeriodMs: number;
}
