import BigNumber from 'bignumber.js';
import type { Asset } from 'types';

export const addUserBorrowLimitShares = ({
  assets,
  userBorrowLimitCents,
}: {
  assets: Asset[];
  userBorrowLimitCents: BigNumber;
}) => {
  const formattedAssets: Asset[] = assets.map(asset => ({
    ...asset,
    userBorrowLimitSharePercentage:
      asset.userBorrowBalanceCents.isGreaterThan(0) && userBorrowLimitCents.isGreaterThan(0)
        ? new BigNumber(asset.userBorrowBalanceCents)
            .times(100)
            .div(userBorrowLimitCents)
            .dp(2)
            .toNumber()
        : 0,
  }));

  return {
    assets: formattedAssets,
  };
};
