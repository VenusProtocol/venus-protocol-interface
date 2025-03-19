import type { Address, PublicClient } from 'viem';

import { primeAbi } from 'libs/contracts';

export interface GetPrimeTokenInput {
  accountAddress: Address;
  primeContractAddress: Address;
  publicClient: PublicClient;
}

export type GetPrimeTokenOutput = {
  exists: boolean;
  isIrrevocable: boolean;
};

const getPrimeToken = async ({
  publicClient,
  primeContractAddress,
  accountAddress,
}: GetPrimeTokenInput): Promise<GetPrimeTokenOutput> => {
  const [exists, isIrrevocable] = await publicClient.readContract({
    address: primeContractAddress,
    abi: primeAbi,
    functionName: 'tokens',
    args: [accountAddress],
  });

  return {
    exists,
    isIrrevocable,
  };
};

export default getPrimeToken;
