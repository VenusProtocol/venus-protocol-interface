import { type MarketHistoryPeriodType, useGetMarketHistory } from 'clients/api';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import type { VToken } from 'types';

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

  const supplyChartData = marketSnapshotsData.marketSnapshots;
  const borrowChartData = marketSnapshotsData.marketSnapshots;

  return {
    isLoading,
    data: {
      supplyChartData,
      borrowChartData,
    },
  };
};
