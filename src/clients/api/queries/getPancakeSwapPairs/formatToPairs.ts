import { CurrencyAmount as PSCurrencyAmount, Pair as PSPair } from '@pancakeswap/sdk/dist/index.js';
import BigNumber from 'bignumber.js';
import { ContractCallResults } from 'ethereum-multicall';

import { PairAddress } from './types';

const formatToPairs = ({
  pairAddresses,
  reserveCallResults,
}: {
  pairAddresses: PairAddress[];
  reserveCallResults: ContractCallResults;
}): PSPair[] =>
  pairAddresses.reduce((acc, pairAddress) => {
    const reserveCallResult =
      reserveCallResults.results[pairAddress.address].callsReturnContext[0].returnValues;

    // Exclude pair if results don't include it
    if (!reserveCallResult?.length) {
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
      PSCurrencyAmount.fromRawAmount(token0, new BigNumber(reserveCallResult[0].hex).toFixed()),
      PSCurrencyAmount.fromRawAmount(token1, new BigNumber(reserveCallResult[1].hex).toFixed()),
    );

    // Exclude pair if it already exists
    if (
      acc.find(existingPair => existingPair.liquidityToken.address === pair.liquidityToken.address)
    ) {
      return acc;
    }

    return [...acc, pair];
  }, [] as PSPair[]);

export default formatToPairs;
