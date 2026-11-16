import type { LiteEarnAsset } from '../types';

export const getHighestApyMarket = (earnAsset: LiteEarnAsset) =>
  earnAsset.markets.reduce((best, market) =>
    market.apyPercentage.gt(best.apyPercentage) ? market : best,
  );
