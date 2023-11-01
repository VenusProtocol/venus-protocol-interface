import BigNumber from 'bignumber.js';
import {
  PoolLens,
  Prime,
  ResilientOracle,
  VaiVault,
  VenusLens,
  XvsVault,
} from 'packages/contracts';
import { Token } from 'types';

export interface GetPendingRewardsInput {
  tokens: Token[];
  isolatedPoolComptrollerAddresses: string[];
  xvsVestingVaultPoolCount: number;
  accountAddress: string;
  resilientOracleContract: ResilientOracle;
  poolLensContract: PoolLens;
  vaiVaultContract: VaiVault;
  xvsVaultContract: XvsVault;
  venusLensContract?: VenusLens;
  primeContract?: Prime;
  mainPoolComptrollerContractAddress?: string;
}

export interface GetPendingRewardsOutput {
  pendingRewardGroups: PendingRewardGroup[];
}

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
  stakedToken: Token;
  rewardToken: Token;
  rewardAmountWei: BigNumber;
  rewardAmountCents: BigNumber | undefined;
}

export interface PrimePendingReward {
  rewardToken: Token;
  rewardAmountWei: BigNumber;
  rewardAmountCents: BigNumber | undefined;
}

export interface PrimePendingRewardGroup {
  type: 'prime';
  isDisabled: boolean;
  vTokenAddressesWithPendingReward: string[];
  pendingRewards: PrimePendingReward[];
}

export type PendingRewardGroup =
  | MainPoolPendingRewardGroup
  | IsolatedPoolPendingRewardGroup
  | VaultPendingRewardGroup
  | XvsVestingVaultPendingRewardGroup
  | PrimePendingRewardGroup;
