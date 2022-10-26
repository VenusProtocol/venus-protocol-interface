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

    const pair = new PSPair(
      PSCurrencyAmount.fromRawAmount(
        pairAddress.tokenCombination[0],
        new BigNumber(reserveCallResult[0].hex).toFixed(),
      ),
      PSCurrencyAmount.fromRawAmount(
        pairAddress.tokenCombination[1],
        new BigNumber(reserveCallResult[1].hex).toFixed(),
      ),
    );

    return [...acc, pair];
  }, [] as PSPair[]);

export default formatToPairs;
