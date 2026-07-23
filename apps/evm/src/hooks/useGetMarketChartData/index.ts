import BigNumber from 'bignumber.js';

import { type MarketHistoryPeriodType, useGetMarketHistory } from 'clients/api';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import type { MarketHistoryDataPoint, VToken } from 'types';

export const useGetMarketChartData = ({
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
      enabled: isApyChartsFeatureEnabled && !!vToken,
    },
  );

  const supplyChartData: MarketHistoryDataPoint[] = [];
  const borrowChartData: MarketHistoryDataPoint[] = [];

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

  return {
    isLoading,
    data: {
      supplyChartData,
      borrowChartData,
    },
  };
};
