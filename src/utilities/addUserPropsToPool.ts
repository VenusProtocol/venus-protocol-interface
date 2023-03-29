import { Pool } from 'types';

export type AddUserPropsToPoolInput = Omit<
  Pool,
  'userSupplyBalanceCents' | 'userBorrowBalanceCents' | 'userBorrowLimitCents'
>;

const addUserPropsToPool = (input: AddUserPropsToPoolInput): Pool => {
  const userSpecificProps = input.assets.reduce(
    (acc, asset) => {
      let assetUserSupplyBalanceCents: number | undefined;

      // Calculate user supply balance
      if (asset.userSupplyBalanceTokens) {
        assetUserSupplyBalanceCents = asset.userSupplyBalanceTokens
          .multipliedBy(asset.tokenPriceDollars)
          // Convert to cents
          .multipliedBy(100)
          .dp(0)
          .toNumber();

        acc.userSupplyBalanceCents =
          (acc.userSupplyBalanceCents || 0) + assetUserSupplyBalanceCents;
      }

      // Calculate user borrow limit
      // Initialize user borrow limit if necessary
      if (acc.userBorrowLimitCents === undefined && assetUserSupplyBalanceCents !== undefined) {
        acc.userBorrowLimitCents = 0;
      }

      if (assetUserSupplyBalanceCents && asset.isCollateralOfUser) {
        acc.userBorrowLimitCents =
          (acc.userBorrowLimitCents || 0) + assetUserSupplyBalanceCents * asset.collateralFactor;
      }

      // Calculate user borrow balance
      if (asset.userBorrowBalanceTokens) {
        const assetUserBorrowBalanceCents = asset.userBorrowBalanceTokens
          .multipliedBy(asset.tokenPriceDollars)
          // Convert to cents
          .multipliedBy(100)
          .dp(0)
          .toNumber();

        acc.userBorrowBalanceCents =
          (acc.userBorrowBalanceCents || 0) + assetUserBorrowBalanceCents;
      }

      return acc;
    },
    {
      userSupplyBalanceCents: undefined,
      userBorrowBalanceCents: undefined,
      userBorrowLimitCents: undefined,
    } as {
      userSupplyBalanceCents: Pool['userSupplyBalanceCents'];
      userBorrowBalanceCents: Pool['userBorrowBalanceCents'];
      userBorrowLimitCents: Pool['userBorrowLimitCents'];
    },
  );

  return {
    ...input,
    ...userSpecificProps,
  };
};

export default addUserPropsToPool;
