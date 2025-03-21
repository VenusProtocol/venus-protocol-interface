import BigNumber from 'bignumber.js';
import type { Address, PublicClient } from 'viem';

import { primeAbi } from 'libs/contracts';

export interface GetPrimeDistributionForMarketInput {
  vTokenAddress: Address;
  primeContractAddress: Address;
  publicClient: PublicClient;
}

export interface GetPrimeDistributionForMarketOutput {
  totalDistributedMantissa: BigNumber;
}

const getPrimeDistributionForMarket = async ({
  vTokenAddress,
  primeContractAddress,
  publicClient,
}: GetPrimeDistributionForMarketInput): Promise<GetPrimeDistributionForMarketOutput> => {
  const totalDistributedMantissa = await publicClient.readContract({
    address: primeContractAddress,
    abi: primeAbi,
    functionName: 'incomeDistributionYearly',
    args: [vTokenAddress],
  });

  return {
    totalDistributedMantissa: new BigNumber(totalDistributedMantissa.toString()),
  };
};

export default getPrimeDistributionForMarket;
