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
    });

  // Recalculate average entry price
  const entryPriceTokens = simulatedYieldPlusPosition?.longBalanceTokens.isGreaterThan(0)
    ? simulatedYieldPlusPosition.shortBalanceTokens.div(
        simulatedYieldPlusPosition.longBalanceTokens,
      )
    : undefined;

  if (simulatedYieldPlusPosition && entryPriceTokens) {
    simulatedYieldPlusPosition.entryPriceTokens = entryPriceTokens;
  }

  return {
    data: simulatedYieldPlusPosition && {
      position: simulatedYieldPlusPosition,
    },
    ...otherProps,
  };
};
