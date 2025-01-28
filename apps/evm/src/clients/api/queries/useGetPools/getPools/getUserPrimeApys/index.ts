import { primeAbi } from 'libs/contracts';
import { convertAprBipsToApy } from 'utilities';
import type { Address, PublicClient } from 'viem';
import type { PrimeApy } from '../../types';

export const getUserPrimeApys = async ({
  publicClient,
  primeContractAddress,
  accountAddress,
  primeVTokenAddresses,
}: {
  publicClient: PublicClient;
  primeContractAddress: Address;
  accountAddress: Address;
  primeVTokenAddresses: readonly Address[];
}) => {
  const primeAprs = await Promise.all(
    primeVTokenAddresses.map(primeVTokenAddress =>
      publicClient.readContract({
        address: primeContractAddress,
        abi: primeAbi,
        functionName: 'calculateAPR',
        args: [primeVTokenAddress, accountAddress],
      }),
    ),
  );

  const userPrimeApyMap = new Map<string, PrimeApy>();
  primeAprs.forEach((primeApr, index) => {
    const apys: PrimeApy = {
      borrowApy: convertAprBipsToApy({ aprBips: primeApr.borrowAPR.toString() || '0' }),
      supplyApy: convertAprBipsToApy({ aprBips: primeApr.supplyAPR.toString() || '0' }),
    };

    userPrimeApyMap.set(primeVTokenAddresses[index], apys);
  });

  return { userPrimeApyMap };
};
