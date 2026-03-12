import BigNumber from 'bignumber.js';

import type { SwapQuote } from 'types';
import { getSwapFromTokenAmount } from 'utilities';

interface Volume {
  fromTokenAmountCents: BigNumber;
  priceImpactPercentage: number;
}

export interface WeightedAveragePriceImpactItem {
  swapQuote: SwapQuote;
  fromTokenPriceCents: BigNumber;
}

export const calculateWeightedAverageSwapPriceImpact = (
  items: WeightedAveragePriceImpactItem[],
) => {
  const volumes = items.map<Volume>(item => {
    const fromTokenAmountTokens = getSwapFromTokenAmount(item.swapQuote) || new BigNumber(0);
    const fromTokenAmountCents = fromTokenAmountTokens.multipliedBy(item.fromTokenPriceCents);

    return {
      fromTokenAmountCents,
      priceImpactPercentage: item.swapQuote.priceImpactPercentage,
    };
  });

  const totalFromTokenAmountCents = volumes.reduce(
    (acc, volume) => acc.plus(volume.fromTokenAmountCents),
    new BigNumber(0),
  );

  if (totalFromTokenAmountCents.isZero()) {
    return 0;
  }

  const weightedAveragePriceImpactPercentage = volumes
    .reduce(
      (acc, volume) =>
        acc.plus(volume.fromTokenAmountCents.multipliedBy(volume.priceImpactPercentage).div(100)),
      new BigNumber(0),
    )
    .div(totalFromTokenAmountCents)
    .multipliedBy(100)
    .toNumber();

  return weightedAveragePriceImpactPercentage;
};
