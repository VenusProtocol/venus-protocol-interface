import { ContractTransaction } from 'ethers';
import { Multicall3 } from 'packages/contracts';
import { Token } from 'types';

export interface VaiVaultClaim {
  contract: 'vaiVault';
}

export interface XvsVestingVaultClaim {
  contract: 'xvsVestingVault';
  rewardToken: Token;
  poolIndex: number;
}

export interface MainPoolComptrollerClaim {
  contract: 'mainPoolComptroller';
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
  | MainPoolComptrollerClaim
  | RewardsDistributorClaim
  | PrimeClaim;

export interface ClaimRewardsInput {
  multicallContract: Multicall3;
  mainPoolComptrollerContractAddress: string;
  vaiVaultContractAddress: string;
  xvsVaultContractAddress: string;
  accountAddress: string;
  claims: Claim[];
  primeContractAddress?: string;
}

export type ClaimRewardsOutput = ContractTransaction;
