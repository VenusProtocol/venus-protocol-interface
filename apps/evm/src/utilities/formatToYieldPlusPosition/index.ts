import BigNumber from 'bignumber.js';
import type { Address } from 'viem';

import type { Asset, ChainId, Pool, YieldPlusPosition } from 'types';
import { areAddressesEqual } from 'utilities/areAddressesEqual';

// TODO: add tests

export const formatToYieldPlusPosition = ({
  pool,
  chainId,
  positionAccountAddress,
  dsaVTokenAddress,
  longVTokenAddress,
  shortVTokenAddress,
  leverageFactor,
  unrealizedPnlCents,
  unrealizedPnlPercentage,
  averageEntryRatio,
}: {
  pool: Pool;
  chainId: ChainId;
  positionAccountAddress: Address;
  dsaVTokenAddress: Address;
  longVTokenAddress: Address;
  shortVTokenAddress: Address;
  leverageFactor: number;
  unrealizedPnlCents: number;
  unrealizedPnlPercentage: number;
  averageEntryRatio: number | BigNumber;
}) => {
  let dsaAsset: Asset | undefined;
  let longAsset: Asset | undefined;
  let shortAsset: Asset | undefined;

  pool.assets.forEach(asset => {
    if (areAddressesEqual(asset.vToken.address, dsaVTokenAddress)) {
      dsaAsset = asset;
    }

    if (areAddressesEqual(asset.vToken.address, shortVTokenAddress)) {
      shortAsset = asset;
    }

    if (areAddressesEqual(asset.vToken.address, longVTokenAddress)) {
      longAsset = asset;
    }
  });

  if (!longAsset || !shortAsset || !dsaAsset) {
    return undefined;
  }

  const longBalanceTokens = longAsset.userSupplyBalanceTokens;
  const shortBalanceTokens = shortAsset.userBorrowBalanceTokens;
  const dsaBalanceTokens = dsaAsset.userSupplyBalanceTokens;

  const longBalanceCents = longAsset.userSupplyBalanceCents;
  const shortBalanceCents = shortAsset.userBorrowBalanceCents;
  const dsaBalanceCents = dsaAsset.userSupplyBalanceCents;

  const priceTokens = longBalanceTokens.isZero()
    ? new BigNumber(0)
    : shortBalanceTokens.dividedBy(longBalanceTokens);

  const priceCents = priceTokens.multipliedBy(shortAsset.tokenPriceCents).toNumber();

  const collateralLt = new BigNumber(dsaAsset.liquidationThresholdPercentage).dividedBy(100);
  const longLt = new BigNumber(longAsset.liquidationThresholdPercentage).dividedBy(100);

  const liquidationPriceTokens =
    longBalanceTokens.isZero() || longLt.isZero() || shortAsset.tokenPriceCents.isZero()
      ? new BigNumber(0)
      : shortBalanceTokens
          .minus(
            dsaBalanceTokens
              .multipliedBy(dsaAsset.tokenPriceCents.dividedBy(shortAsset.tokenPriceCents))
              .multipliedBy(collateralLt),
          )
          .dividedBy(longBalanceTokens.multipliedBy(longLt));

  const liquidationPriceCents = liquidationPriceTokens.multipliedBy(shortAsset.tokenPriceCents);

  const averageEntryPriceTokens = new BigNumber(averageEntryRatio);
  const averageEntryPriceCents = averageEntryPriceTokens
    .multipliedBy(shortAsset.tokenPriceCents)
    .toNumber();

  const totalSupplyValueCents = dsaBalanceCents.plus(longBalanceCents);
  const shortBorrowApyPercentage = shortAsset.borrowApyPercentage.absoluteValue();
  const netApyPercentage = totalSupplyValueCents.isZero()
    ? 0
    : dsaBalanceCents
        .multipliedBy(dsaAsset.supplyApyPercentage)
        .plus(longBalanceCents.multipliedBy(longAsset.supplyApyPercentage))
        .minus(shortBalanceCents.multipliedBy(shortBorrowApyPercentage))
        .dividedBy(totalSupplyValueCents)
        .toNumber();

  const netValueCents = dsaBalanceCents.plus(longBalanceCents).minus(shortBalanceCents).toNumber();

  const position: YieldPlusPosition = {
    chainId,
    positionAccountAddress,
    unrealizedPnlCents,
    unrealizedPnlPercentage,
    leverageFactor,
    pool,
    longAsset,
    longBalanceTokens,
    longBalanceCents: longBalanceCents.toNumber(),
    shortAsset,
    shortBalanceTokens,
    shortBalanceCents: shortBalanceCents.toNumber(),
    dsaAsset,
    dsaBalanceTokens,
    dsaBalanceCents: dsaBalanceCents.toNumber(),
    netValueCents,
    netApyPercentage,
    priceTokens,
    priceCents,
    liquidationPriceTokens,
    liquidationPriceCents: liquidationPriceCents.toNumber(),
    averageEntryPriceTokens,
    averageEntryPriceCents,
  };

  return position;
};
