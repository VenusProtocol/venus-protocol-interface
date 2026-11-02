import type { Asset } from 'types';
import { getRankingApyPercentage } from '../getRankingApyPercentage';

export const getBorrowApyPercentage = (asset: Asset) =>
  getRankingApyPercentage({
    type: 'borrow',
    baseApyPercentage: asset.borrowApyPercentage,
    tokenDistributions: asset.borrowTokenDistributions,
  });
