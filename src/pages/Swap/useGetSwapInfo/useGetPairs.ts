import { Pair as PSPair, Token as PSToken } from '@pancakeswap/sdk/dist/index.js';
import { useMemo } from 'react';

const useGetPairs = (tokenCombinations: [PSToken, PSToken][]) => {
  // Generate pair addresses
  const pairAddresses = useMemo(
    () =>
      tokenCombinations
        .map(([tokenA, tokenB]) => {
          try {
            return tokenA && tokenB && !tokenA.equals(tokenB)
              ? PSPair.getAddress(tokenA, tokenB)
              : undefined;
          } catch {
            // Do nothing
            return undefined;
          }
        })
        // Remove undefined values
        .filter(address => !!address),
    [tokenCombinations],
  );

  console.log('pairAddresses', pairAddresses);

  return [];
};

export default useGetPairs;
