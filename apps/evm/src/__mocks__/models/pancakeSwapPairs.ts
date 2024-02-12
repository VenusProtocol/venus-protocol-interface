import { CurrencyAmount as PSCurrencyAmount, Pair as PSPair } from '@pancakeswap/sdk/dist/index.js';
import BigNumber from 'bignumber.js';

import fakeTokenCombinations from '__mocks__/models/tokenCombinations';

const pancakeSwapPairs: PSPair[] = fakeTokenCombinations.map(
  ([tokenA, tokenB]) =>
    new PSPair(
      PSCurrencyAmount.fromRawAmount(tokenA, new BigNumber(10).pow(tokenA.decimals).toFixed()),
      PSCurrencyAmount.fromRawAmount(tokenB, new BigNumber(10).pow(tokenB.decimals).toFixed()),
    ),
);

export default pancakeSwapPairs;
