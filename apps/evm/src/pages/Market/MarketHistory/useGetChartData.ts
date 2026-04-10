import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { type MarketHistoryPeriodType, useGetMarketHistory } from 'clients/api';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import type { ApyChartProps } from 'pages/Market/MarketHistory/Card/ApyChart';
import type { VToken } from 'types';

const useGetChartData = ({
  vToken,
  period,
}: { vToken: VToken; period: MarketHistoryPeriodType }) => {
  const isApyChartsFeatureEnabled = useIsFeatureEnabled({ name: 'apyCharts' });
  const {
    isLoading,
    data: marketSnapshotsData = {
      marketSnapshots: [],
    },
  } = useGetMarketHistory(
    {
      vToken,
      period,
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
        const timestampMs = Number(marketSnapshot.blockTimestamp) * 1000;

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
