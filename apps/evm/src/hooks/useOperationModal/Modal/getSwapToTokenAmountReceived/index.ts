import type BigNumber from 'bignumber.js';
import type { Swap } from 'types';
import { convertMantissaToTokens } from 'utilities';

export const getSwapToTokenAmountReceivedTokens = (swap?: Swap) => {
  let swapToTokenAmountReceivedTokens: BigNumber | undefined;

  if (swap) {
    const swapToTokenAmountReceivedMantissa =
      swap.direction === 'exactAmountOut'
        ? swap.toTokenAmountReceivedMantissa
        : swap.expectedToTokenAmountReceivedMantissa;

    swapToTokenAmountReceivedTokens = convertMantissaToTokens({
      value: swapToTokenAmountReceivedMantissa,
      token: swap.toToken,
    });
  }

  return { swapToTokenAmountReceivedTokens };
};
