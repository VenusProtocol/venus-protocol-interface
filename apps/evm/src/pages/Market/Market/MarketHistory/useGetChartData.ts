import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useGetMarketHistory } from 'clients/api';
import type { ApyChartProps } from 'components/charts/ApyChart';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import type { VToken } from 'types';

const useGetChartData = ({ vToken }: { vToken: VToken }) => {
  const isApyChartsFeatureEnabled = useIsFeatureEnabled({ name: 'apyCharts' });
  const {
    isLoading,
    data: marketSnapshotsData = {
      marketSnapshots: [],
    },
  } = useGetMarketHistory(
    {
      vToken,
    },
    {
      enabled: isApyChartsFeatureEnabled,
    },
  );

  const data = useMemo(() => {
    const supplyChartData: ApyChartProps['data'] = [];
    const borrowChartData: ApyChartProps['data'] = [];

    [...marketSnapshotsData.marketSnapshots]
      // Snapshots are already reversed, due to the negative slice
      .forEach(marketSnapshot => {
        const timestampMs = marketSnapshot.blockTimestamp * 1000;

        supplyChartData.push({
          apyPercentage: +marketSnapshot.supplyApy,
          timestampMs,
          balanceCents: new BigNumber(marketSnapshot.totalSupplyCents),
        });

        borrowChartData.push({
          apyPercentage: +marketSnapshot.borrowApy,
          timestampMs,
          balanceCents: new BigNumber(marketSnapshot.totalBorrowCents),
        });
      });

    return { supplyChartData, borrowChartData };
  }, [marketSnapshotsData]);

  return {
    isLoading,
    data,
  };
};

export default useGetChartData;
