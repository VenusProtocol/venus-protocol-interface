import type { Address, PublicClient } from 'viem';

import { primeV2Abi } from 'libs/contracts';

export interface GetIsUserPrimeInput {
  accountAddress: Address;
  primeV2ContractAddress: Address;
  publicClient: PublicClient;
}

export type GetIsUserPrimeOutput = {
  isPrime: boolean;
};

export const getIsUserPrime = async ({
  publicClient,
  primeV2ContractAddress,
  accountAddress,
}: GetIsUserPrimeInput): Promise<GetIsUserPrimeOutput> => {
  const isPrime = await publicClient.readContract({
    address: primeV2ContractAddress,
    abi: primeV2Abi,
    functionName: 'isPrimeHolder',
    args: [accountAddress],
  });

  return {
    isPrime,
  };
};
