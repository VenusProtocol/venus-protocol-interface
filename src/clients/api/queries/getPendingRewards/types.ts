import BigNumber from 'bignumber.js';
import { Multicall } from 'ethereum-multicall';
import { Token } from 'types';

export interface GetPendingRewardGroupsInput {
  mainPoolComptrollerAddress: string;
  isolatedPoolComptrollerAddresses: string[];
  xvsVestingVaultPoolCount: number;
  multicall: Multicall;
  accountAddress: string;
}

export type GetPendingRewardGroupsOutput = {
  pendingRewardGroups: PendingRewardGroup[];
};

export interface PoolPendingReward {
  rewardToken: Token;
  rewardAmountWei: BigNumber;
  vTokenAddressesWithPendingReward: string[];
}

export interface PoolPendingRewardGroup {
  type: 'pool';
  comptrollerAddress: string;
  pendingRewards: PoolPendingReward[];
}

export interface VaultPendingRewardGroup {
  type: 'vault' | 'vestingVault';
  stakedToken: Token;
  rewardToken: Token;
  rewardAmountWei: BigNumber;
}

export type PendingRewardGroup = PoolPendingRewardGroup | VaultPendingRewardGroup;
