import type { LiteBorrowAsset } from '../types';

export const getLowestApyMarket = (borrowAsset: LiteBorrowAsset) =>
  borrowAsset.markets.reduce((best, market) =>
    market.apyPercentage.lt(best.apyPercentage) ? market : best,
  );
