import type BigNumber from 'bignumber.js';

import type { PoolLens, Prime, VaiVault, VenusLens, XvsVault } from 'libs/contracts';
import type { ChainId, MerklDistribution, Token } from 'types';
import type { Address } from 'viem';

export interface GetPendingRewardsInput {
  tokens: Token[];
  isolatedPoolComptrollerAddresses: string[];
  xvsVestingVaultPoolCount: number;
  accountAddress: Address;
  poolLensContract: PoolLens;
  xvsVaultContract: XvsVault;
  vaiVaultContract?: VaiVault;
  venusLensContract?: VenusLens;
  primeContract?: Prime;
  legacyPoolComptrollerContractAddress?: string;
  chainId: ChainId;
  merklCampaigns: Record<string, MerklDistribution[]>; // maps Asset -> Merkl campaigns
}

interface PendingRewardEntry {
  vTokenAddress: string;
  amountMantissa: BigNumber;
}

export type PendingInternalRewardSummary = {
  type: 'legacyPool' | 'isolatedPool';
  poolComptrollerAddress: string;
  distributorAddress: string;
  rewardTokenAddress: string;
  totalRewards: BigNumber;
  pendingRewards: PendingRewardEntry[];
};

export type PendingExternalRewardSummary = {
  type: 'external';
  appName: string;
  campaignId: string;
  campaignName: string;
  claimUrl: string;
  distributorAddress: string;
  rewardTokenAddress: string;
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
  vTokenAddressesWithPendingReward: string[];
  rewardsDistributorAddress: string;
}

export interface ExternalPendingReward {
  campaignName: string;
  appName: string;
  claimUrl: string;
  rewardToken: Token;
  rewardAmountMantissa: BigNumber;
  rewardAmountCents: BigNumber | undefined;
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
  vTokenAddressesWithPendingReward: string[];
  pendingRewards: PrimePendingReward[];
}

export type PendingRewardGroup =
  | LegacyPoolPendingRewardGroup
  | IsolatedPoolPendingRewardGroup
  | VaultPendingRewardGroup
  | XvsVestingVaultPendingRewardGroup
  | PrimePendingRewardGroup
  | ExternalPendingRewardGroup;
