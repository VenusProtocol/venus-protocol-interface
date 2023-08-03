import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

export interface GetXvsVaultPoolInfoInput {
  xvsVaultContract: ContractTypeByName<'xvsVault'>;
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
