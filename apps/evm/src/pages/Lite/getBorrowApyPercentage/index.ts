import type { Asset } from 'types';
import getCombinedApy from 'utilities/getCombinedApy';

export const getBorrowApyPercentage = (asset: Asset) =>
  getCombinedApy({
    type: 'borrow',
    baseApyPercentage: asset.borrowApyPercentage,
    tokenDistributions: asset.borrowTokenDistributions,
  }).totalApyPercentage;
