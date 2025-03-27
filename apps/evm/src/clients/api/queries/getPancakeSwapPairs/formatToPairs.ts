import { CurrencyAmount as PSCurrencyAmount, Pair as PSPair } from '@pancakeswap/sdk';
import { areAddressesEqual } from 'utilities';

import type { PairAddress } from './types';

export const formatToPairs = ({
  pairAddresses,
  reservesResults,
}: {
  pairAddresses: PairAddress[];
  reservesResults: ([bigint, bigint, number] | undefined)[];
}): PSPair[] =>
  pairAddresses.reduce((acc, pairAddress, index) => {
    const pairReserves = reservesResults[index];

    // Exclude pair if reserves could not be fetched
    if (!pairReserves) {
      return acc;
    }

    // Sort tokens. Reserves returned from the smart contract are sorted by
    // token address, so the first reserve value corresponds to the token for
    // which the address sorts before the other token's address of the pair
    const [token0, token1] = pairAddress.tokenCombination[0].sortsBefore(
      pairAddress.tokenCombination[1],
    )
      ? [pairAddress.tokenCombination[0], pairAddress.tokenCombination[1]]
      : [pairAddress.tokenCombination[1], pairAddress.tokenCombination[0]];

    const pair = new PSPair(
      PSCurrencyAmount.fromRawAmount(token0, pairReserves[0].toString()),
      PSCurrencyAmount.fromRawAmount(token1, pairReserves[1].toString()),
    );

    // Exclude pair if it already exists
    if (
      acc.find(existingPair =>
        areAddressesEqual(existingPair.liquidityToken.address, pair.liquidityToken.address),
      )
    ) {
      return acc;
    }

    return [...acc, pair];
  }, [] as PSPair[]);
