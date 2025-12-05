import type {
  ApproximateOutSwapQuote,
  ExactInSwapQuote,
  ExactOutSwapQuote,
  SwapQuoteDirection,
  Token,
} from 'types';
import type { ApiSwapQuote } from '../types';
import { subtractSlippagePercentage } from './subtractSlippagePercentage';

export const formatSwapQuote = ({
  direction,
  fromToken,
  toToken,
  apiSwapQuote,
  slippagePercentage,
}: {
  direction: SwapQuoteDirection;
  fromToken: Token;
  toToken: Token;
  apiSwapQuote: ApiSwapQuote;
  slippagePercentage: number;
}) => {
  const sharedProps = {
    fromToken,
    toToken,
    priceImpactPercentage: apiSwapQuote.priceImpact,
    callData: apiSwapQuote.swapHelperMulticall.calldata.encodedCall,
  };

  if (direction === 'exact-in') {
    const expectedToTokenAmountReceivedMantissa = BigInt(apiSwapQuote.amountOut);
    const minimumToTokenAmountReceivedMantissa = subtractSlippagePercentage({
      amount: expectedToTokenAmountReceivedMantissa,
      slippagePercentage,
    });

    const swapQuote: ExactInSwapQuote = {
      ...sharedProps,
      fromTokenAmountSoldMantissa: BigInt(apiSwapQuote.amountIn),
      expectedToTokenAmountReceivedMantissa,
      minimumToTokenAmountReceivedMantissa,
      direction: 'exact-in',
    };

    return swapQuote;
  }

  if (direction === 'exact-out') {
    const expectedFromTokenAmountSoldMantissa = BigInt(apiSwapQuote.amountIn);
    const maximumFromTokenAmountSoldMantissa = subtractSlippagePercentage({
      amount: expectedFromTokenAmountSoldMantissa,
      slippagePercentage,
    });

    const swapQuote: ExactOutSwapQuote = {
      ...sharedProps,
      expectedFromTokenAmountSoldMantissa,
      maximumFromTokenAmountSoldMantissa,
      toTokenAmountReceivedMantissa: BigInt(apiSwapQuote.amountOut),
      direction: 'exact-out',
    };

    return swapQuote;
  }

  // Approximate out swap
  const expectedToTokenAmountReceivedMantissa = BigInt(apiSwapQuote.amountOut);
  const minimumToTokenAmountReceivedMantissa = subtractSlippagePercentage({
    amount: expectedToTokenAmountReceivedMantissa,
    slippagePercentage,
  });

  const swapQuote: ApproximateOutSwapQuote = {
    ...sharedProps,
    fromTokenAmountSoldMantissa: BigInt(apiSwapQuote.amountIn),
    expectedToTokenAmountReceivedMantissa,
    minimumToTokenAmountReceivedMantissa,
    direction: 'approximate-out',
  };

  return swapQuote;
};
