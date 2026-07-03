import BigNumber from 'bignumber.js';
import type { Address, PublicClient } from 'viem';

import { primeLeaderboardAbi } from 'libs/contracts';

export interface GetPrimeEffectiveStakeInput {
  accountAddress: Address;
  primeLeaderboardContractAddress: Address;
  publicClient: PublicClient;
}

export interface GetPrimeEffectiveStakeOutput {
  effectiveStakeMantissa: BigNumber;
  totalStakedMantissa: BigNumber;
}

export const getPrimeEffectiveStake = async ({
  accountAddress,
  primeLeaderboardContractAddress,
  publicClient,
}: GetPrimeEffectiveStakeInput): Promise<GetPrimeEffectiveStakeOutput> => {
  const [effectiveStake, totalStaked] = await Promise.all([
    publicClient.readContract({
      address: primeLeaderboardContractAddress,
      abi: primeLeaderboardAbi,
      functionName: 'getEffectiveStake',
      args: [accountAddress],
    }),
    publicClient.readContract({
      address: primeLeaderboardContractAddress,
      abi: primeLeaderboardAbi,
      functionName: 'getTotalStaked',
      args: [accountAddress],
    }),
  ]);

  return {
    effectiveStakeMantissa: new BigNumber(effectiveStake.toString()),
    totalStakedMantissa: new BigNumber(totalStaked.toString()),
  };
};
