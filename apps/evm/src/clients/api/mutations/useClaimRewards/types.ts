import type { PrimeVersion, Token } from 'types';
import type { Address } from 'viem';

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
  vTokenAddressesWithPendingReward: Address[];
}

export interface RewardsDistributorClaim {
  contract: 'rewardsDistributor';
  contractAddress: Address;
  comptrollerContractAddress: Address;
  vTokenAddressesWithPendingReward: Address[];
}

export interface PrimeClaim {
  contract: 'prime';
  primeVersion: PrimeVersion;
  vTokenAddressesWithPendingReward: Address[];
}

export type Claim =
  | VaiVaultClaim
  | XvsVestingVaultClaim
  | LegacyPoolComptrollerClaim
  | RewardsDistributorClaim
  | PrimeClaim;

export type ClaimRewardsInput = {
  claims: Claim[];
};
