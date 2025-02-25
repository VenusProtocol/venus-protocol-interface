import { Pair as PSPair } from '@pancakeswap/sdk';
import { pancakePairV2Abi } from 'libs/contracts';
import type { Address } from 'viem';
import formatToPairs from './formatToPairs';
import type { GetPancakeSwapPairsInput, GetPancakeSwapPairsOutput, PairAddress } from './types';

export * from './types';

const getPancakeSwapPairs = async ({
  tokenCombinations,
  publicClient,
}: GetPancakeSwapPairsInput): Promise<GetPancakeSwapPairsOutput> => {
  // Generate pair addresses from token combinations
  const pairAddresses: PairAddress[] = tokenCombinations.reduce((acc, [tokenA, tokenB]) => {
    try {
      const address = PSPair.getAddress(tokenA, tokenB) as Address;

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

  // Fetch all reserves in a single multicall
  const results = await publicClient.multicall({
    contracts: pairAddresses.map(pairAddress => ({
      address: pairAddress.address,
      abi: pancakePairV2Abi,
      functionName: 'getReserves',
    })),
  });
  const reservesResults = results.map(r => r.result) as (undefined | [bigint, bigint, number])[];

  const pairs = formatToPairs({
    pairAddresses,
    reservesResults,
  });

  return { pairs };
};

export default getPancakeSwapPairs;
