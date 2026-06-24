import type { Address, PublicClient } from 'viem';

import { primeV2Abi } from 'libs/contracts';

export interface GetIsUserPrimeV2Input {
  accountAddress: Address;
  primeV2ContractAddress: Address;
  publicClient: PublicClient;
}

export interface GetIsUserPrimeV2Output {
  isPrimeHolder: boolean;
}

export const getIsUserPrimeV2 = async ({
  accountAddress,
  primeV2ContractAddress,
  publicClient,
}: GetIsUserPrimeV2Input): Promise<GetIsUserPrimeV2Output> => {
  const isPrimeHolder = await publicClient.readContract({
    address: primeV2ContractAddress,
    abi: primeV2Abi,
    functionName: 'isPrimeHolder',
    args: [accountAddress],
  });

  return {
    isPrimeHolder,
  };
};
