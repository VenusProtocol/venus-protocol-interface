import BigNumber from 'bignumber.js';
import type { Asset } from 'types';

export const addUserBorrowLimitShares = <TAsset extends Asset>({
  assets,
  userBorrowLimitCents,
}: {
  assets: TAsset[];
  userBorrowLimitCents: BigNumber;
}) => {
  const formattedAssets: TAsset[] = assets.map(asset => ({
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
