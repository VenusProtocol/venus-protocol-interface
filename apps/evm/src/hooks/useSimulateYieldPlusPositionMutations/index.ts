import BigNumber from 'bignumber.js';

import { useGetSimulatedPool } from 'clients/api';
import type { PositionFormAction } from 'pages/YieldPlus/PositionForm';
import type { BalanceMutation, YieldPlusPosition } from 'types';
import { clampToZero, convertTokensToMantissa, formatToYieldPlusPosition } from 'utilities';

export const useSimulateYieldPlusMutations = ({
  dsaAmountTokens,
  balanceMutations,
  position,
  action,
}: {
  balanceMutations: BalanceMutation[];
  position: YieldPlusPosition;
  dsaAmountTokens?: BigNumber;
  action: PositionFormAction;
}) => {
  const { data, ...otherProps } = useGetSimulatedPool({
    pool: position?.pool,
    balanceMutations,
  });

  const simulatedPool = data?.pool;

  let dsaBalanceTokens = position.dsaBalanceTokens;
  const sanitizedDsaAmountTokens = new BigNumber(dsaAmountTokens || 0);

  if (action === 'supplyDsa' || action === 'open') {
    dsaBalanceTokens = dsaBalanceTokens.plus(sanitizedDsaAmountTokens);
  } else if (action === 'withdrawDsa') {
    dsaBalanceTokens = clampToZero({
      value: dsaBalanceTokens.minus(sanitizedDsaAmountTokens),
    });
  }

  const simulatedYieldPlusPosition =
    simulatedPool &&
    formatToYieldPlusPosition({
      pool: simulatedPool,
      chainId: position.chainId,
      dsaBalanceMantissa: convertTokensToMantissa({
        value: dsaBalanceTokens,
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
