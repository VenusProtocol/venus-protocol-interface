import type BigNumber from 'bignumber.js';

import type {
  PoolLens,
  Prime,
  ResilientOracle,
  VaiVault,
  VenusLens,
  XvsVault,
} from 'libs/contracts';
import type { Token } from 'types';

export interface GetPendingRewardsInput {
  tokens: Token[];
  isolatedPoolComptrollerAddresses: string[];
  xvsVestingVaultPoolCount: number;
  accountAddress: string;
  resilientOracleContract: ResilientOracle;
  poolLensContract: PoolLens;
  xvsVaultContract: XvsVault;
  vaiVaultContract?: VaiVault;
  venusLensContract?: VenusLens;
  primeContract?: Prime;
  legacyPoolComptrollerContractAddress?: string;
}

export interface GetPendingRewardsOutput {
  pendingRewardGroups: PendingRewardGroup[];
}

export interface IsolatedPoolPendingReward {
  rewardToken: Token;
  rewardAmountMantissa: BigNumber;
  rewardAmountCents: BigNumber | undefined;
  vTokenAddressesWithPendingReward: string[];
  rewardsDistributorAddress: string;
}

export interface IsolatedPoolPendingRewardGroup {
  type: 'isolatedPool';
  comptrollerAddress: string;
  pendingRewards: IsolatedPoolPendingReward[];
}

export interface LegacyPoolPendingRewardGroup {
  type: 'legacyPool';
  comptrollerAddress: string;
  rewardToken: Token;
  rewardAmountMantissa: BigNumber;
  rewardAmountCents: BigNumber | undefined;
  vTokenAddressesWithPendingReward: string[];
}

export interface VaultPendingRewardGroup {
  type: 'vault';
  isDisabled: boolean;
  stakedToken: Token;
  rewardToken: Token;
  rewardAmountMantissa: BigNumber;
  rewardAmountCents: BigNumber | undefined;
}

export interface XvsVestingVaultPendingRewardGroup {
  type: 'xvsVestingVault';
  isDisabled: boolean;
  poolIndex: number;
  stakedToken: Token;
  rewardToken: Token;
  rewardAmountMantissa: BigNumber;
  rewardAmountCents: BigNumber | undefined;
}

export interface PrimePendingReward {
  rewardToken: Token;
  rewardAmountMantissa: BigNumber;
  rewardAmountCents: BigNumber | undefined;
}

export interface PrimePendingRewardGroup {
  type: 'prime';
  isDisabled: boolean;
  vTokenAddressesWithPendingReward: string[];
  pendingRewards: PrimePendingReward[];
}

export type PendingRewardGroup =
  | LegacyPoolPendingRewardGroup
  | IsolatedPoolPendingRewardGroup
  | VaultPendingRewardGroup
  | XvsVestingVaultPendingRewardGroup
  | PrimePendingRewardGroup;
