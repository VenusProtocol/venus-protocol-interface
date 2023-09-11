import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';
import { Token } from 'types';

export interface GetPendingRewardGroupsInput {
  tokens: Token[];
  isolatedPoolComptrollerAddresses: string[];
  xvsVestingVaultPoolCount: number;
  accountAddress: string;
  xvsTokenAddress: string;
  resilientOracleContract: ContractTypeByName<'resilientOracle'>;
  poolLensContract: ContractTypeByName<'poolLens'>;
  vaiVaultContract: ContractTypeByName<'vaiVault'>;
  xvsVaultContract: ContractTypeByName<'xvsVault'>;
  venusLensContract?: ContractTypeByName<'venusLens'>;
  mainPoolComptrollerContractAddress?: string;
}

export interface GetPendingRewardGroupsOutput {
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
  rewardToken: Token;
  rewardAmountWei: BigNumber;
  rewardAmountCents: BigNumber | undefined;
}

export type PendingRewardGroup =
  | MainPoolPendingRewardGroup
  | IsolatedPoolPendingRewardGroup
  | VaultPendingRewardGroup
  | XvsVestingVaultPendingRewardGroup;
