import BigNumber from 'bignumber.js';
import { Multicall as Multicall3 } from 'ethereum-multicall';
import { Token } from 'types';

export interface GetPendingRewardGroupsInput {
  mainPoolComptrollerContractAddress: string;
  isolatedPoolComptrollerAddresses: string[];
  xvsVestingVaultPoolCount: number;
  multicall3: Multicall3;
  accountAddress: string;
  venusLensContractAddress: string;
  resilientOracleContractAddress: string;
  poolLensContractAddress: string;
  vaiVaultContractAddress: string;
  xvsVaultContractAddress: string;
}

export type GetPendingRewardGroupsOutput = {
  pendingRewardGroups: PendingRewardGroup[];
};

export interface IsolatedPoolPendingReward {
  rewardToken: Token;
  rewardAmountWei: BigNumber;
  rewardAmountCents: BigNumber | undefined;
  vTokenAddressesWithPendingReward: string[];
  rewardsDistributorAddress: string;
}

export interface IsolatedPoolPendingRewardGroup {
  type: 'isolatedPool';
  comptrollerAddress: string;
  pendingRewards: IsolatedPoolPendingReward[];
}

export interface MainPoolPendingRewardGroup {
  type: 'mainPool';
  comptrollerAddress: string;
  rewardToken: Token;
  rewardAmountWei: BigNumber;
  rewardAmountCents: BigNumber | undefined;
  vTokenAddressesWithPendingReward: string[];
}

export interface VaultPendingRewardGroup {
  type: 'vault';
  stakedToken: Token;
  rewardToken: Token;
  rewardAmountWei: BigNumber;
  rewardAmountCents: BigNumber | undefined;
}

export interface XvsVestingVaultPendingRewardGroup {
  type: 'xvsVestingVault';
  poolIndex: number;
  rewardToken: Token;
  rewardAmountWei: BigNumber;
  rewardAmountCents: BigNumber | undefined;
}

export type PendingRewardGroup =
  | MainPoolPendingRewardGroup
  | IsolatedPoolPendingRewardGroup
  | VaultPendingRewardGroup
  | XvsVestingVaultPendingRewardGroup;
