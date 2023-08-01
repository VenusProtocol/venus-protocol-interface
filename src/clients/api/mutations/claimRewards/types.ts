import { ContractReceipt } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

export interface VaiVaultClaim {
  contract: 'vaiVault';
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
  | XvsVestingVaultClaim
  | MainPoolComptrollerClaim
  | RewardsDistributorClaim;

export interface ClaimRewardsInput {
  multicallContract: ContractTypeByName<'multicall'>;
  mainPoolComptrollerContractAddress: string;
  vaiVaultContractAddress: string;
  xvsVaultContractAddress: string;
  accountAddress: string;
  claims: Claim[];
}

export type ClaimRewardsOutput = ContractReceipt;
