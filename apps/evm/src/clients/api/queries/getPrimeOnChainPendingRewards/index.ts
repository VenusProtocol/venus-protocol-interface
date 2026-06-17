import BigNumber from 'bignumber.js';
import type { Address, PublicClient } from 'viem';

import { primeV2Abi } from 'libs/contracts';

export interface PrimeOnChainPendingReward {
  vTokenAddress: Address;
  rewardTokenAddress: Address;
  amountMantissa: BigNumber;
}

export interface GetPrimeOnChainPendingRewardsInput {
  accountAddress: Address;
  primeV2ContractAddress: Address;
  publicClient: PublicClient;
}

export interface GetPrimeOnChainPendingRewardsOutput {
  rewards: PrimeOnChainPendingReward[];
}

export const getPrimeOnChainPendingRewards = async ({
  accountAddress,
  primeV2ContractAddress,
  publicClient,
}: GetPrimeOnChainPendingRewardsInput): Promise<GetPrimeOnChainPendingRewardsOutput> => {
  const pendingRewards = await publicClient.readContract({
    address: primeV2ContractAddress,
    abi: primeV2Abi,
    functionName: 'getPendingRewardsStatic',
    args: [accountAddress],
  });

  const rewards = pendingRewards.map(reward => ({
    vTokenAddress: reward.vToken,
    rewardTokenAddress: reward.rewardToken,
    amountMantissa: new BigNumber(reward.amount.toString()),
  }));

  return { rewards };
};
