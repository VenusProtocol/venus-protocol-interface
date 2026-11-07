import BigNumber from 'bignumber.js';
import type { LiteBorrowAsset } from '../types';

export const getLowestBorrowApyPercentage = (borrowAsset: LiteBorrowAsset) =>
  BigNumber.minimum(...borrowAsset.markets.map(market => market.apyPercentage));
