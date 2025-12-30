import type { Swap, SwapQuote } from 'types';
import { convertMantissaToTokens } from 'utilities';

export const getSwapToTokenAmountReceivedTokens = (swap?: Swap | SwapQuote) => {
  if (swap) {
    const swapToTokenAmountReceivedMantissa =
      swap.direction === 'exactAmountOut' || swap.direction === 'exact-out'
        ? swap.toTokenAmountReceivedMantissa
        : swap.expectedToTokenAmountReceivedMantissa;

    return convertMantissaToTokens({
      value: swapToTokenAmountReceivedMantissa,
      token: swap.toToken,
    });
  }

  return undefined;
};
