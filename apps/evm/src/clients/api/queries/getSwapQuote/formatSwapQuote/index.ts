import type {
  ApproximateOutSwapQuote,
  ExactInSwapQuote,
  ExactOutSwapQuote,
  SwapQuoteDirection,
  Token,
} from 'types';
import type { ApiSwapQuote } from '../types';

export const formatSwapQuote = ({
  direction,
  fromToken,
  toToken,
  apiSwapQuote,
}: {
  direction: SwapQuoteDirection;
  fromToken: Token;
  toToken: Token;
  apiSwapQuote: ApiSwapQuote;
}) => {
  const sharedProps = {
    fromToken,
    toToken,
    priceImpactPercentage: apiSwapQuote.priceImpact,
  };

  if (direction === 'exact-in') {
    const swapQuote: ExactInSwapQuote = {
      ...sharedProps,
      fromTokenAmountSoldMantissa: BigInt(apiSwapQuote.amountIn),
      expectedToTokenAmountReceivedMantissa: BigInt(apiSwapQuote.amountOut),
      minimumToTokenAmountReceivedMantissa: BigInt(apiSwapQuote.amountOutMin),
      direction: 'exact-in',
    };

    return swapQuote;
  }

  if (direction === 'exact-out') {
    const swapQuote: ExactOutSwapQuote = {
      ...sharedProps,
      expectedFromTokenAmountSoldMantissa: BigInt(apiSwapQuote.amountIn),
      maximumFromTokenAmountSoldMantissa: BigInt(apiSwapQuote.amountInMax),
      toTokenAmountReceivedMantissa: BigInt(apiSwapQuote.amountOut),
      direction: 'exact-out',
    };

    return swapQuote;
  }

  // Approximate out swap
  const swapQuote: ApproximateOutSwapQuote = {
    ...sharedProps,
    fromTokenAmountSoldMantissa: BigInt(apiSwapQuote.amountIn),
    expectedToTokenAmountReceivedMantissa: BigInt(apiSwapQuote.amountOut),
    minimumToTokenAmountReceivedMantissa: BigInt(apiSwapQuote.amountOutMin),
    direction: 'approximate-out',
  };

  return swapQuote;
};
