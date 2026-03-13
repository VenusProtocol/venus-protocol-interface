import { useGetSimulatedPool } from 'clients/api';
import type { BalanceMutation, YieldPlusPosition } from 'types';
import { formatToYieldPlusPosition } from 'utilities';

// TODO: add tests

export const useSimulateYieldPlusMutations = ({
  balanceMutations,
  position,
}: {
  balanceMutations: BalanceMutation[];
  position: YieldPlusPosition;
}) => {
  const { data, ...otherProps } = useGetSimulatedPool({
    pool: position?.pool,
    balanceMutations,
  });

  const simulatedPool = data?.pool;

  // TODO: recalculate averageEntryRatio (requires more data from the backend)

  const simulatedYieldPlusPosition =
    simulatedPool &&
    formatToYieldPlusPosition({
      pool: simulatedPool,
      chainId: position.chainId,
      positionAccountAddress: position.positionAccountAddress,
      dsaVTokenAddress: position.dsaAsset.vToken.address,
      longVTokenAddress: position.longAsset.vToken.address,
      shortVTokenAddress: position.shortAsset.vToken.address,
      leverageFactor: position.leverageFactor,
      unrealizedPnlCents: position.unrealizedPnlCents,
      unrealizedPnlPercentage: position.unrealizedPnlPercentage,
      averageEntryRatio: position.averageEntryPriceTokens,
    });

  return {
    data: simulatedYieldPlusPosition && {
      position: simulatedYieldPlusPosition,
    },
    ...otherProps,
  };
};
