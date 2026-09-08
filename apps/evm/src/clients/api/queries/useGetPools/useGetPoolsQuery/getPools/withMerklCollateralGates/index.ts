import BigNumber from 'bignumber.js';

import type { Asset } from 'types';
import { areAddressesEqual } from 'utilities';

// Collateral only backs borrows made within the same pool, so callers pass a single pool's assets
export const withMerklCollateralGates = ({ assets }: { assets: Asset[] }): Asset[] => {
  let changed = false;

  const updatedAssets = assets.map(asset => {
    let assetChanged = false;

    const borrowTokenDistributions = asset.borrowTokenDistributions.map(distribution => {
      if (distribution.type !== 'merkl') {
        return distribution;
      }

      const {
        aprPercentage = 0,
        participatingCollateralAddresses = [],
        eligibleBorrowMarketAddresses = [],
      } = distribution.rewardDetails;

      const maxApyPercentage = new BigNumber(aprPercentage);

      // No gate means no badge and no reward row: there is nothing to advertise
      if (eligibleBorrowMarketAddresses.length === 0 || !maxApyPercentage.isGreaterThan(0)) {
        return distribution;
      }

      const collateralCents = assets.reduce((acc, collateralAsset) => {
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

      const eligibleLoanCents = assets.reduce(
        (acc, borrowAsset) =>
          eligibleBorrowMarketAddresses.some(address =>
            areAddressesEqual(address, borrowAsset.vToken.address),
          )
            ? acc.plus(borrowAsset.userBorrowBalanceCents)
            : acc,
        new BigNumber(0),
      );

      const isUserEligible = collateralCents.isGreaterThan(0) && eligibleLoanCents.isGreaterThan(0);

      assetChanged = true;

      return {
        ...distribution,
        collateralGate: { isUserEligible, maxApyPercentage },
        apyPercentage: isUserEligible
          ? maxApyPercentage
              .multipliedBy(BigNumber.minimum(collateralCents, eligibleLoanCents))
              .dividedBy(eligibleLoanCents)
          : new BigNumber(0),
      };
    });

    if (!assetChanged) {
      return asset;
    }

    changed = true;
    return { ...asset, borrowTokenDistributions };
  });

  return changed ? updatedAssets : assets;
};
