import type { ApproximateOutSwapQuote, ExactInSwapQuote } from 'types';
import { lisUsd, usdc } from './tokens';

export const exactInSwapQuote: ExactInSwapQuote = {
  fromToken: usdc,
  toToken: lisUsd,
  direction: 'exact-in',
  priceImpactPercentage: 0.1,
  fromTokenAmountSoldMantissa: 100000000n,
  expectedToTokenAmountReceivedMantissa: 100000000n,
  minimumToTokenAmountReceivedMantissa: 100000000n,
  callData: '0x',
};

export const approximateOutSwapQuote: ApproximateOutSwapQuote = {
  fromToken: lisUsd,
  toToken: usdc,
  direction: 'approximate-out',
  priceImpactPercentage: 0.1,
  fromTokenAmountSoldMantissa: 100000000n,
  expectedToTokenAmountReceivedMantissa: 100000000n,
  minimumToTokenAmountReceivedMantissa: 100000000n,
  callData: '0x',
};
