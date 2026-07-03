import { primeAbi, primeV2LensAbi } from 'libs/contracts';
import type { PrimeVersion } from 'types';
import { convertAprBipsToApy } from 'utilities';
import type { Address, PublicClient } from 'viem';
import type { PrimeApy } from '../../../types';

export const getUserPrimeApys = async ({
  publicClient,
  primeContractAddress,
  accountAddress,
  primeVTokenAddresses,
  primeVersion,
}: {
  publicClient: PublicClient;
  primeContractAddress: Address;
  accountAddress: Address;
  primeVTokenAddresses: readonly Address[];
  primeVersion: PrimeVersion;
}) => {
  const primeAprs = await Promise.all(
    primeVTokenAddresses.map(primeVTokenAddress =>
      publicClient.readContract({
        address: primeContractAddress,
        abi: primeVersion === 1 ? primeAbi : primeV2LensAbi,
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
