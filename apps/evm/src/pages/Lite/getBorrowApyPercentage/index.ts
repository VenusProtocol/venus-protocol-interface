import type { Asset } from 'types';
import { getBestDistributionApys } from 'utilities';

export const getBorrowApyPercentage = (asset: Asset) =>
  getBestDistributionApys({ asset }).totalBorrowApyPercentage;
