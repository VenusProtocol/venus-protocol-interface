import type BigNumber from 'bignumber.js';

import type { ChainId, MerklDistribution, Token } from 'types';
import type { Address, PublicClient } from 'viem';

export interface GetPendingRewardsInput {
  chainId: ChainId;
  tokens: Token[];
  publicClient: PublicClient;
  isolatedPoolComptrollerAddresses: Address[];
  xvsVestingVaultPoolCount: number;
  accountAddress: Address;
  merklCampaigns: Record<Address, MerklDistribution[]>; // maps asset addresses with Merkl campaigns
  poolLensContractAddress: Address;
  xvsVaultContractAddress: Address;
  vaiVaultContractAddress?: Address;
  venusLensContractAddress?: Address;
  primeContractAddress?: Address;
  legacyPoolComptrollerContractAddress?: Address;
}

interface PendingRewardEntry {
  vTokenAddress: Address;
  amountMantissa: BigNumber;
}

export type PendingInternalRewardSummary = {
  type: 'legacyPool' | 'isolatedPool';
  poolComptrollerAddress: Address;
  distributorAddress: Address;
  rewardTokenAddress: Address;
  totalRewards: BigNumber;
  pendingRewards: PendingRewardEntry[];
};

export type PendingExternalRewardSummary = {
  type: 'external';
  appName: string;
  campaignId: string;
  campaignName: string;
  claimUrl: string;
  rewardTokenAddress: Address;
  totalRewards: BigNumber;
  pendingRewards: PendingRewardEntry[];
};

export interface GetPendingRewardsOutput {
  pendingRewardGroups: PendingRewardGroup[];
}

export interface IsolatedPoolPendingReward {
  rewardToken: Token;
  rewardAmountMantissa: BigNumber;
  rewardAmountCents: BigNumber | undefined;
  vTokenAddressesWithPendingReward: Address[];
  rewardsDistributorAddress: Address;
}

export interface ExternalPendingReward {
  campaignName: string;
  appName: string;
  claimUrl: string;
  rewardToken: Token;
  rewardAmountMantissa: BigNumber;
  rewardAmountCents: BigNumber | undefined;
}

export interface IsolatedPoolPendingRewardGroup {
  type: 'isolatedPool';
  comptrollerAddress: Address;
  pendingRewards: IsolatedPoolPendingReward[];
}

export interface LegacyPoolPendingRewardGroup {
  type: 'legacyPool';
  comptrollerAddress: Address;
  rewardToken: Token;
  rewardAmountMantissa: BigNumber;
  rewardAmountCents: BigNumber | undefined;
  vTokenAddressesWithPendingReward: Address[];
}

export interface ExternalPendingRewardGroup {
  type: 'external';
  claimUrl: string;
  campaignName: string;
  appName: string;
  pendingRewards: ExternalPendingReward[];
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
  vTokenAddressesWithPendingReward: Address[];
  pendingRewards: PrimePendingReward[];
}

export type PendingRewardGroup =
  | LegacyPoolPendingRewardGroup
  | IsolatedPoolPendingRewardGroup
  | VaultPendingRewardGroup
  | XvsVestingVaultPendingRewardGroup
  | PrimePendingRewardGroup
  | ExternalPendingRewardGroup;
