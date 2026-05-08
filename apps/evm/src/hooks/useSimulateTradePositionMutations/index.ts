import BigNumber from 'bignumber.js';

import { useGetSimulatedPool } from 'clients/api';
import type { PositionFormAction } from 'pages/Trade/PositionForm';
import type { BalanceMutation, TradePosition } from 'types';
import { clampToZero, convertTokensToMantissa, formatToTradePosition } from 'utilities';

export const useSimulateTradeMutations = ({
  dsaAmountTokens,
  balanceMutations,
  position,
  action,
}: {
  balanceMutations: BalanceMutation[];
  position: TradePosition;
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

  const simulatedTradePosition =
    simulatedPool &&
    formatToTradePosition({
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
  const entryPriceTokens = simulatedTradePosition?.longBalanceTokens.isGreaterThan(0)
    ? simulatedTradePosition.shortBalanceTokens.div(simulatedTradePosition.longBalanceTokens)
    : undefined;

  if (simulatedTradePosition && entryPriceTokens) {
    simulatedTradePosition.entryPriceTokens = entryPriceTokens;
  }

  return {
    data: simulatedTradePosition && {
      position: simulatedTradePosition,
    },
    ...otherProps,
  };
};
