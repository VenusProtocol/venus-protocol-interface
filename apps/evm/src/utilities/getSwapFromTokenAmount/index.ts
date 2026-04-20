import type { Swap, SwapQuote } from 'types';
import { convertMantissaToTokens } from 'utilities';

export const getSwapFromTokenAmount = (swap?: Swap | SwapQuote) => {
  if (swap) {
    const swapFromTokenAmountMantissa =
      swap.direction === 'exactAmountOut' || swap.direction === 'exact-out'
        ? swap.expectedFromTokenAmountSoldMantissa
        : swap.fromTokenAmountSoldMantissa;

    return convertMantissaToTokens({
      value: swapFromTokenAmountMantissa,
      token: swap.fromToken,
    });
  }

  return undefined;
};
