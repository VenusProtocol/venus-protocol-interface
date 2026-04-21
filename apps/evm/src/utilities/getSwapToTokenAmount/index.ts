import type { Swap, SwapQuote } from 'types';
import { convertMantissaToTokens } from 'utilities';

export const getSwapToTokenAmount = (swap?: Swap | SwapQuote) => {
  if (swap) {
    const swapToTokenAmountMantissa =
      swap.direction === 'exactAmountOut' || swap.direction === 'exact-out'
        ? swap.toTokenAmountReceivedMantissa
        : swap.expectedToTokenAmountReceivedMantissa;

    return convertMantissaToTokens({
      value: swapToTokenAmountMantissa,
      token: swap.toToken,
    });
  }

  return undefined;
};
