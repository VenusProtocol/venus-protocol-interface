import { Pair as PSPair } from '@pancakeswap/sdk/dist/index.js';
import { getPancakePairV2Contract } from 'libs/contracts';

import formatToPairs from './formatToPairs';
import { GetPancakeSwapPairsInput, GetPancakeSwapPairsOutput, PairAddress } from './types';

export * from './types';

const getPancakeSwapPairs = async ({
  tokenCombinations,
  provider,
}: GetPancakeSwapPairsInput): Promise<GetPancakeSwapPairsOutput> => {
  // Generate pair addresses from token combinations
  const pairAddresses: PairAddress[] = tokenCombinations.reduce((acc, [tokenA, tokenB]) => {
    try {
      const address = PSPair.getAddress(tokenA, tokenB);

      const pairAddress: PairAddress = {
        tokenCombination: [tokenA, tokenB],
        address,
      };

      return [...acc, pairAddress];
    } catch {
      // PSPair.getAddress can error out, in which case we exclude the pair from
      // the list
      return acc;
    }
  }, [] as PairAddress[]);

  // Fetch each token combination reserves
  const reservesResults = await Promise.allSettled(
    pairAddresses.map(pairAddress => {
      const pancakePairContract = getPancakePairV2Contract({
        address: pairAddress.address,
        signerOrProvider: provider,
      });

      return pancakePairContract.getReserves();
    }),
  );

  const pairs = formatToPairs({
    pairAddresses,
    reservesResults,
  });

  return { pairs };
};

export default getPancakeSwapPairs;
