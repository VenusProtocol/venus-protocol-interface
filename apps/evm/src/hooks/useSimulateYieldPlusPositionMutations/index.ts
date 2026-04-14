import type BigNumber from 'bignumber.js';

import { useGetSimulatedPool } from 'clients/api';
import type { BalanceMutation, YieldPlusPosition } from 'types';
import { convertTokensToMantissa, formatToYieldPlusPosition } from 'utilities';

export const useSimulateYieldPlusMutations = ({
  dsaAmountTokens,
  balanceMutations,
  position,
}: {
  balanceMutations: BalanceMutation[];
  position: YieldPlusPosition;
  dsaAmountTokens?: BigNumber;
}) => {
  const { data, ...otherProps } = useGetSimulatedPool({
    pool: position?.pool,
    balanceMutations,
  });

  const simulatedPool = data?.pool;

  // [VPD-920 DEBUG] Log the tokenPriceCents that will be used in the liq price formula
  if (simulatedPool) {
    const shortAssetInSim = simulatedPool.assets.find(
      a => a.vToken.address.toLowerCase() === position.shortAsset.vToken.address.toLowerCase(),
    );
    console.log('[VPD-920] shortAsset.tokenPriceCents entering formatToYieldPlusPosition:', {
      symbol: position.shortAsset.vToken.underlyingToken.symbol,
      tokenPriceCents: shortAssetInSim?.tokenPriceCents.toFixed(),
      note: 'if this is stale, liq price will be wrong',
    });
  }

  const simulatedYieldPlusPosition =
    simulatedPool &&
    formatToYieldPlusPosition({
      pool: simulatedPool,
      chainId: position.chainId,
      dsaBalanceMantissa: convertTokensToMantissa({
        value: position.dsaBalanceTokens.plus(dsaAmountTokens || 0),
        token: position.dsaAsset.vToken.underlyingToken,
      }),
      positionAccountAddress: position.positionAccountAddress,
      dsaVTokenAddress: position.dsaAsset.vToken.address,
      longVTokenAddress: position.longAsset.vToken.address,
      shortVTokenAddress: position.shortAsset.vToken.address,
      leverageFactor: position.leverageFactor,
      unrealizedPnlCents: position.unrealizedPnlCents,
      unrealizedPnlPercentage: position.unrealizedPnlPercentage,
      averageEntryRatio: position.averageEntryPriceTokens,
      totalLongReceivedMantissa: convertTokensToMantissa({
        value: position.totalLongReceivedTokens,
        token: position.shortAsset.vToken.underlyingToken,
      }),
      totalShortOpenedMantissa: convertTokensToMantissa({
        value: position.totalShortOpenedTokens,
        token: position.shortAsset.vToken.underlyingToken,
      }),
    });

  // Recalculate average entry price
  const addedShortTokens = simulatedYieldPlusPosition?.shortBalanceTokens.minus(
    position.shortBalanceTokens,
  );
  const addedLongTokens = simulatedYieldPlusPosition?.longBalanceTokens.minus(
    position.longBalanceTokens,
  );
  const averageEntryPriceTokens =
    addedShortTokens && addedLongTokens && !addedLongTokens.isZero() && simulatedYieldPlusPosition
      ? simulatedYieldPlusPosition.totalShortOpenedTokens
          .plus(addedShortTokens)
          .div(simulatedYieldPlusPosition.totalLongReceivedTokens.plus(addedLongTokens))
      : undefined;

  if (simulatedYieldPlusPosition && averageEntryPriceTokens) {
    simulatedYieldPlusPosition.averageEntryPriceTokens = averageEntryPriceTokens;
  }

  return {
    data: simulatedYieldPlusPosition && {
      position: simulatedYieldPlusPosition,
    },
    ...otherProps,
  };
};
