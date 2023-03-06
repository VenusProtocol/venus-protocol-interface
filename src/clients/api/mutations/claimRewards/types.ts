import { ContractReceipt } from 'ethers';

import { Multicall as MulticallContract } from 'types/contracts';

export interface VaiVaultClaim {
  contract: 'vaiVault';
}

export interface VrtVaultClaim {
  contract: 'vrtVault';
}

export interface XvsVestingVaultClaim {
  contract: 'xvsVestingVault';
  rewardTokenAddress: string;
  poolIndex: number;
}

export interface MainPoolComptrollerClaim {
  contract: 'mainPoolComptroller';
  vTokenAddressesWithPendingReward: string[];
}

export interface RewardsDistributorClaim {
  contract: 'rewardsDistributor';
  contractAddress: string;
  vTokenAddressesWithPendingReward: string[];
}

export type Claim =
  | VaiVaultClaim
  | VrtVaultClaim
  | XvsVestingVaultClaim
  | MainPoolComptrollerClaim
  | RewardsDistributorClaim;

export interface ClaimRewardsInput {
  multicallContract: MulticallContract;
  accountAddress: string;
  claims: Claim[];
}

export type ClaimRewardsOutput = ContractReceipt;
