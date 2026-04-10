import BigNumber from 'bignumber.js';
import type { Address } from 'viem';

import type { Asset, ChainId, Pool, YieldPlusPosition } from 'types';
import { areAddressesEqual } from 'utilities/areAddressesEqual';
import areTokensEqual from 'utilities/areTokensEqual';
import convertMantissaToTokens from 'utilities/convertMantissaToTokens';

export const formatToYieldPlusPosition = ({
  pool,
  chainId,
  positionAccountAddress,
  dsaVTokenAddress,
  dsaBalanceMantissa,
  longVTokenAddress,
  shortVTokenAddress,
  leverageFactor,
  unrealizedPnlCents,
  unrealizedPnlPercentage,
}: {
  pool: Pool;
  chainId: ChainId;
  positionAccountAddress: Address;
  dsaVTokenAddress: Address;
  dsaBalanceMantissa: BigNumber;
  longVTokenAddress: Address;
  shortVTokenAddress: Address;
  leverageFactor: number;
  unrealizedPnlCents: number;
  unrealizedPnlPercentage: number;
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

  let dsaBalanceTokens = convertMantissaToTokens({
    value: dsaBalanceMantissa,
    token: dsaAsset.vToken.underlyingToken,
  });

  // Clamp position DSA balance to user DSA supply balance
  dsaBalanceTokens = BigNumber.min(dsaBalanceTokens, dsaAsset.userSupplyBalanceTokens);

  let longBalanceTokens = longAsset.userSupplyBalanceTokens;
  // If long and DSA tokens are from the same market, then we need to deduct the DSA balance from
  // the long balance
  if (areTokensEqual(longAsset.vToken, dsaAsset.vToken)) {
    longBalanceTokens = longBalanceTokens.minus(dsaBalanceTokens);
  }

  const shortBalanceTokens = shortAsset.userBorrowBalanceTokens;

  const dsaBalanceCents = dsaBalanceTokens.multipliedBy(dsaAsset.tokenPriceCents).dp(0);
  const longBalanceCents = longBalanceTokens.multipliedBy(longAsset.tokenPriceCents).dp(0);
  const shortBalanceCents = shortAsset.userBorrowBalanceCents;

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

  const entryPriceTokens = longBalanceTokens.isZero()
    ? new BigNumber(0)
    : shortBalanceTokens.dividedBy(longBalanceTokens);

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
    liquidationPriceTokens,
    entryPriceTokens,
  };

  return position;
};
