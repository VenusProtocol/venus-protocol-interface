import BigNumber from 'bignumber.js';
import { Pool } from 'types';

export type AddUserPropsToPoolInput = Omit<
  Pool,
  'userSupplyBalanceCents' | 'userBorrowBalanceCents' | 'userBorrowLimitCents'
>;

const addUserPropsToPool = (input: AddUserPropsToPoolInput): Pool => {
  const userSpecificProps = input.assets.reduce(
    (acc, asset) => {
      let assetUserSupplyBalanceCents: BigNumber | undefined;

      // Calculate user supply balance
      if (asset.userSupplyBalanceTokens) {
        assetUserSupplyBalanceCents = asset.userSupplyBalanceTokens.multipliedBy(
          asset.tokenPriceCents,
        );

        acc.userSupplyBalanceCents = (acc.userSupplyBalanceCents || new BigNumber(0)).plus(
          assetUserSupplyBalanceCents,
        );
      }

      // Calculate user borrow limit
      // Initialize user borrow limit if necessary
      if (acc.userBorrowLimitCents === undefined && assetUserSupplyBalanceCents !== undefined) {
        acc.userBorrowLimitCents = new BigNumber(0);
      }

      if (assetUserSupplyBalanceCents && asset.isCollateralOfUser) {
        acc.userBorrowLimitCents = (acc.userBorrowLimitCents || new BigNumber(0)).plus(
          assetUserSupplyBalanceCents.times(asset.collateralFactor),
        );
      }

      // Calculate user borrow balance
      if (asset.userBorrowBalanceTokens) {
        const assetUserBorrowBalanceCents = asset.userBorrowBalanceTokens.multipliedBy(
          asset.tokenPriceCents,
        );

        acc.userBorrowBalanceCents = (acc.userBorrowBalanceCents || new BigNumber(0)).plus(
          assetUserBorrowBalanceCents,
        );
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
