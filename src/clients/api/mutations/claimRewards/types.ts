import { ContractReceipt } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';
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

export type Claim =
  | VaiVaultClaim
  | XvsVestingVaultClaim
  | MainPoolComptrollerClaim
  | RewardsDistributorClaim;

export interface ClaimRewardsInput {
  multicallContract: ContractTypeByName<'multicall3'>;
  mainPoolComptrollerContractAddress: string;
  vaiVaultContractAddress: string;
  xvsVaultContractAddress: string;
  accountAddress: string;
  claims: Claim[];
}

export type ClaimRewardsOutput = ContractReceipt;
