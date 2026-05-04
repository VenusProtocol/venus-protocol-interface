import BigNumber from 'bignumber.js';

import { busd, usdc, xvs } from '__mocks__/models/tokens';

import type { ExactInSwapQuote, ExactOutSwapQuote } from 'types';
import { calculateWeightedAverageSwapPriceImpact } from '..';

const makeExactInSwapQuote = ({
  fromTokenAmountSoldMantissa,
  fromToken = xvs,
  toToken = busd,
  priceImpactPercentage,
}: {
  fromTokenAmountSoldMantissa: bigint;
  fromToken?: ExactInSwapQuote['fromToken'];
  toToken?: ExactInSwapQuote['toToken'];
  priceImpactPercentage: number;
}): ExactInSwapQuote => ({
  fromToken,
  toToken,
  direction: 'exact-in',
  priceImpactPercentage,
  callData: '0x',
  fromTokenAmountSoldMantissa,
  expectedToTokenAmountReceivedMantissa: 1n,
  minimumToTokenAmountReceivedMantissa: 1n,
});

const makeExactOutSwapQuote = ({
  expectedFromTokenAmountSoldMantissa,
  fromToken = xvs,
  toToken = busd,
  priceImpactPercentage,
}: {
  expectedFromTokenAmountSoldMantissa: bigint;
  fromToken?: ExactOutSwapQuote['fromToken'];
  toToken?: ExactOutSwapQuote['toToken'];
  priceImpactPercentage: number;
}): ExactOutSwapQuote => ({
  fromToken,
  toToken,
  direction: 'exact-out',
  priceImpactPercentage,
  callData: '0x',
  expectedFromTokenAmountSoldMantissa,
  maximumFromTokenAmountSoldMantissa: expectedFromTokenAmountSoldMantissa,
  toTokenAmountReceivedMantissa: 1n,
});

describe('calculateWeightedAverageSwapPriceImpact', () => {
  it('returns the weighted average price impact using from-token dollar value as weight', () => {
    const result = calculateWeightedAverageSwapPriceImpact([
      {
        swapQuote: makeExactInSwapQuote({
          fromTokenAmountSoldMantissa: 1_000_000_000_000_000_000n,
          priceImpactPercentage: 2,
        }),
        fromTokenPriceCents: new BigNumber(100),
      },
      {
        swapQuote: makeExactInSwapQuote({
          fromTokenAmountSoldMantissa: 3_000_000_000_000_000_000n,
          priceImpactPercentage: 6,
        }),
        fromTokenPriceCents: new BigNumber(100),
      },
    ]);

    expect(result).toMatchInlineSnapshot('5');
  });

  it('handles swaps with different from-token decimals and prices', () => {
    const result = calculateWeightedAverageSwapPriceImpact([
      {
        swapQuote: makeExactInSwapQuote({
          fromToken: xvs,
          toToken: busd,
          fromTokenAmountSoldMantissa: 1_000_000_000_000_000_000n,
          priceImpactPercentage: 10,
        }),
        fromTokenPriceCents: new BigNumber(500),
      },
      {
        swapQuote: makeExactInSwapQuote({
          fromToken: usdc,
          toToken: busd,
          fromTokenAmountSoldMantissa: 1_000_000n,
          priceImpactPercentage: 40,
        }),
        fromTokenPriceCents: new BigNumber(1500),
      },
    ]);

    expect(result).toMatchInlineSnapshot('32.5');
  });

  it('does not let zero-dollar swaps affect the weighted average and supports exact-out quotes', () => {
    const result = calculateWeightedAverageSwapPriceImpact([
      {
        swapQuote: makeExactInSwapQuote({
          fromTokenAmountSoldMantissa: 0n,
          priceImpactPercentage: 99,
        }),
        fromTokenPriceCents: new BigNumber(100),
      },
      {
        swapQuote: makeExactOutSwapQuote({
          expectedFromTokenAmountSoldMantissa: 2_000_000_000_000_000_000n,
          priceImpactPercentage: 4,
        }),
        fromTokenPriceCents: new BigNumber(100),
      },
    ]);

    expect(result).toMatchInlineSnapshot('4');
  });
});
