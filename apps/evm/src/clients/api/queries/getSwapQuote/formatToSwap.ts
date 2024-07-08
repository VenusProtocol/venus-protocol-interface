import BigNumber from 'bignumber.js';

import type { Swap, SwapDirection, Token } from 'types';
import type { ZeroXQuoteResponse } from './types';

const formatToSwap = ({
  fromToken,
  toToken,
  direction,
  quote,
}: {
  fromToken: Token;
  toToken: Token;
  direction: SwapDirection;
  quote: ZeroXQuoteResponse;
}) => {
  const sharedProps = {
    fromToken,
    toToken,
    routePath: [], // TODO: remove, irrelevant to 0x
    priceImpactPercentage: +quote.estimatedPriceImpact,
    transactionData: quote.data,
  };

  if (direction === 'exactAmountIn') {
    const swap: Swap = {
      ...sharedProps,
      direction: 'exactAmountIn',
      fromTokenAmountSoldMantissa: new BigNumber(quote.sellAmount),
      exchangeRate: new BigNumber(quote.price).dp(toToken.decimals),
      expectedToTokenAmountReceivedMantissa: new BigNumber(quote.buyAmount), // TODO: merge into one prop
      minimumToTokenAmountReceivedMantissa: new BigNumber(quote.buyAmount), // TODO: merge into one prop
    };

    return swap;
  }

  // "exactAmountOut" case
  const swap: Swap = {
    ...sharedProps,
    direction: 'exactAmountOut',
    exchangeRate: new BigNumber(1).div(quote.price).dp(toToken.decimals),
    expectedFromTokenAmountSoldMantissa: new BigNumber(quote.sellAmount), // TODO: merge into one prop
    maximumFromTokenAmountSoldMantissa: new BigNumber(quote.sellAmount), // TODO: merge into
    toTokenAmountReceivedMantissa: new BigNumber(quote.buyAmount),
  };

  console.log(swap);

  return swap;
};

export default formatToSwap;
