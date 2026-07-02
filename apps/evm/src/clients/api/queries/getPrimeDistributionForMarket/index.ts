import BigNumber from 'bignumber.js';
import type { Address, PublicClient } from 'viem';

import { primeAbi, primeV2LensAbi } from 'libs/contracts';
import type { PrimeVersion } from 'types';

export interface GetPrimeDistributionForMarketInput {
  vTokenAddress: Address;
  primeContractAddress: Address;
  publicClient: PublicClient;
  primeVersion: PrimeVersion;
}

export interface GetPrimeDistributionForMarketOutput {
  totalDistributedMantissa: BigNumber;
}

export const getPrimeDistributionForMarket = async ({
  vTokenAddress,
  primeContractAddress,
  publicClient,
  primeVersion,
}: GetPrimeDistributionForMarketInput): Promise<GetPrimeDistributionForMarketOutput> => {
  const totalDistributedMantissa = await publicClient.readContract({
    address: primeContractAddress,
    abi: primeVersion === 1 ? primeAbi : primeV2LensAbi,
    functionName: 'incomeDistributionYearly',
    args: [vTokenAddress],
  });

  return {
    totalDistributedMantissa: new BigNumber(totalDistributedMantissa.toString()),
  };
};
