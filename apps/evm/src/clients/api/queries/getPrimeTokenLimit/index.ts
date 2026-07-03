import type { Address, PublicClient } from 'viem';

import { primeV2Abi } from 'libs/contracts';

export interface GetPrimeTokenLimitInput {
  primeV2ContractAddress: Address;
  publicClient: PublicClient;
}

export interface GetPrimeTokenLimitOutput {
  tokenLimit: number;
}

export const getPrimeTokenLimit = async ({
  primeV2ContractAddress,
  publicClient,
}: GetPrimeTokenLimitInput): Promise<GetPrimeTokenLimitOutput> => {
  const tokenLimit = await publicClient.readContract({
    address: primeV2ContractAddress,
    abi: primeV2Abi,
    functionName: 'tokenLimit',
  });

  return {
    tokenLimit: Number(tokenLimit),
  };
};
