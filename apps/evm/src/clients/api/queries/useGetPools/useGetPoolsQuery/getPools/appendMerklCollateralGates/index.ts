import BigNumber from 'bignumber.js';

import type { Pool } from 'types';
import { areAddressesEqual } from 'utilities';

export const appendMerklCollateralGates = ({ pools }: { pools: Pool[] }) => {
  // Collateral only backs borrows made within the same pool, so each pool is resolved on its own
  for (const pool of pools) {
    for (const asset of pool.assets) {
      for (const distribution of asset.borrowTokenDistributions) {
        if (distribution.type !== 'merkl') {
          continue;
        }

        const {
          aprPercentage = 0,
          participatingCollateralAddresses = [],
          eligibleBorrowMarketAddresses = [],
        } = distribution.rewardDetails;

        if (eligibleBorrowMarketAddresses.length === 0) {
          continue;
        }

        const collateralCents = pool.assets.reduce((acc, collateralAsset) => {
          const isParticipating = participatingCollateralAddresses.some(address =>
            areAddressesEqual(address, collateralAsset.vToken.address),
          );

          return collateralAsset.isCollateralOfUser && isParticipating
            ? acc.plus(
                collateralAsset.userSupplyBalanceCents.multipliedBy(
                  collateralAsset.userCollateralFactor,
                ),
              )
            : acc;
        }, new BigNumber(0));

        const eligibleLoanCents = pool.assets.reduce(
          (acc, borrowAsset) =>
            eligibleBorrowMarketAddresses.some(address =>
              areAddressesEqual(address, borrowAsset.vToken.address),
            )
              ? acc.plus(borrowAsset.userBorrowBalanceCents)
              : acc,
          new BigNumber(0),
        );

        const maxApyPercentage = new BigNumber(aprPercentage);
        const isUserEligible =
          collateralCents.isGreaterThan(0) && eligibleLoanCents.isGreaterThan(0);

        distribution.collateralGate = { isUserEligible, maxApyPercentage };
        distribution.apyPercentage = isUserEligible
          ? maxApyPercentage
              .multipliedBy(BigNumber.minimum(collateralCents, eligibleLoanCents))
              .dividedBy(eligibleLoanCents)
          : new BigNumber(0);
      }
    }
  }
};
