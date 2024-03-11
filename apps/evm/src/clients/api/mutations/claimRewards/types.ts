import type { ContractTransaction } from 'ethers';

import type { Multicall3 } from 'libs/contracts';
import type { Token } from 'types';

export interface VaiVaultClaim {
  contract: 'vaiVault';
}

export interface XvsVestingVaultClaim {
  contract: 'xvsVestingVault';
  rewardToken: Token;
  poolIndex: number;
}

export interface LegacyPoolComptrollerClaim {
  contract: 'legacyPoolComptroller';
  vTokenAddressesWithPendingReward: string[];
}

export interface RewardsDistributorClaim {
  contract: 'rewardsDistributor';
  contractAddress: string;
  comptrollerContractAddress: string;
  vTokenAddressesWithPendingReward: string[];
}

export interface PrimeClaim {
  contract: 'prime';
  vTokenAddressesWithPendingReward: string[];
}

export type Claim =
  | VaiVaultClaim
  | XvsVestingVaultClaim
  | LegacyPoolComptrollerClaim
  | RewardsDistributorClaim
  | PrimeClaim;

export interface ClaimRewardsInput {
  multicallContract: Multicall3;
  xvsVaultContractAddress: string;
  accountAddress: string;
  claims: Claim[];
  vaiVaultContractAddress?: string;
  legacyPoolComptrollerContractAddress?: string;
  primeContractAddress?: string;
}

export type ClaimRewardsOutput = ContractTransaction;
