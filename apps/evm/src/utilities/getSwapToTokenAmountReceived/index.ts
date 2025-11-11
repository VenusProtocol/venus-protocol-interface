import type { Swap } from 'types';
import { convertMantissaToTokens } from 'utilities';

export const getSwapToTokenAmountReceivedTokens = (swap?: Swap) => {
  if (swap) {
    const swapToTokenAmountReceivedMantissa =
      swap.direction === 'exactAmountOut'
        ? swap.toTokenAmountReceivedMantissa
        : swap.expectedToTokenAmountReceivedMantissa;

    return convertMantissaToTokens({
      value: swapToTokenAmountReceivedMantissa,
      token: swap.toToken,
    });
  }

  return undefined;
};
