import type { Prime } from 'libs/contracts';
import { convertAprBipsToApy } from 'utilities';
import type { PrimeApy } from '../../types';

export const getUserPrimeApys = async ({
  primeContract,
  accountAddress,
  primeVTokenAddresses,
}: { primeContract: Prime; accountAddress: string; primeVTokenAddresses: string[] }) => {
  const primeAprs = await Promise.all(
    primeVTokenAddresses.map(primeVTokenAddress =>
      primeContract.calculateAPR(primeVTokenAddress, accountAddress),
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
