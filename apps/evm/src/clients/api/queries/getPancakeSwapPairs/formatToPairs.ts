import { CurrencyAmount as PSCurrencyAmount, Pair as PSPair } from '@pancakeswap/sdk/dist/index.js';
import { PancakePairV2 } from 'libs/contracts';

import { areAddressesEqual } from 'utilities';

import { PairAddress } from './types';

const formatToPairs = ({
  pairAddresses,
  reservesResults,
}: {
  pairAddresses: PairAddress[];
  reservesResults: PromiseSettledResult<Awaited<ReturnType<PancakePairV2['getReserves']>>>[];
}): PSPair[] =>
  pairAddresses.reduce((acc, pairAddress, index) => {
    const pairReservesCallResult = reservesResults[index];
    const pairReserves =
      pairReservesCallResult.status === 'rejected' ? undefined : pairReservesCallResult.value;

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
      PSCurrencyAmount.fromRawAmount(token0, pairReserves.reserve0.toString()),
      PSCurrencyAmount.fromRawAmount(token1, pairReserves.reserve1.toString()),
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

export default formatToPairs;
