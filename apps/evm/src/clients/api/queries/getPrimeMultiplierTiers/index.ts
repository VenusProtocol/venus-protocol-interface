import BigNumber from 'bignumber.js';
import type { Address, PublicClient } from 'viem';

import { primeLeaderboardAbi } from 'libs/contracts';

export interface PrimeMultiplierTier {
  durationSeconds: number;
  multiplierMantissa: BigNumber;
}

export interface GetPrimeMultiplierTiersInput {
  primeLeaderboardContractAddress: Address;
  publicClient: PublicClient;
}

export interface GetPrimeMultiplierTiersOutput {
  tiers: PrimeMultiplierTier[];
}

export const getPrimeMultiplierTiers = async ({
  primeLeaderboardContractAddress,
  publicClient,
}: GetPrimeMultiplierTiersInput): Promise<GetPrimeMultiplierTiersOutput> => {
  const [durations, multipliers] = await publicClient.readContract({
    address: primeLeaderboardContractAddress,
    abi: primeLeaderboardAbi,
    functionName: 'getMultiplierTiers',
    args: [],
  });

  const tiers = durations.map((duration, index) => ({
    durationSeconds: Number(duration),
    multiplierMantissa: new BigNumber(multipliers[index].toString()),
  }));

  return { tiers };
};
