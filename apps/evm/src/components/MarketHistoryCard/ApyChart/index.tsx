import { theme } from '@venusprotocol/ui';

import { AreaChart } from 'components';
import { useBreakpointUp } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import type { MarketHistoryDataPoint } from 'types';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatToReadableDate,
} from 'utilities';
import type { ChartHistoryPeriod } from 'utilities/formatToReadableDate';

export interface ApyChartProps {
  data: MarketHistoryDataPoint[];
  type: 'supply' | 'borrow';
  selectedPeriod: ChartHistoryPeriod;
  className?: string;
}

export const ApyChart: React.FC<ApyChartProps> = ({ className, data, type, selectedPeriod }) => {
  const { t } = useTranslation();
  const isSmOrUp = useBreakpointUp('sm');

  const formatDate = (timestampMs: number, period?: ChartHistoryPeriod) =>
    formatToReadableDate({
      timestampMs,
      selectedPeriod: period,
      t,
    });

  const isSupplyChart = type === 'supply';
  const chartColor = isSupplyChart ? theme.colors.green : theme.colors.red;
  const chartInterval = isSmOrUp ? 5 : 3;
  const apyDataKey = isSupplyChart ? 'supplyApyPercentage' : 'borrowApyPercentage';
  const balanceDataKey = isSupplyChart ? 'totalSupplyCents' : 'totalBorrowCents';
  const apyLabel = isSupplyChart
    ? t('apyChart.tooltipItemLabels.supplyApy')
    : t('apyChart.tooltipItemLabels.borrowApy');
  const balanceLabel = isSupplyChart
    ? t('apyChart.tooltipItemLabels.totalSupply')
    : t('apyChart.tooltipItemLabels.totalBorrow');

  return (
    <AreaChart
      data={data}
      xAxisDataKey="blockTimestamp"
      yAxisDataKey={apyDataKey}
      className={className}
      formatXAxisValue={formatDate}
      formatYAxisValue={formatPercentageToReadableValue}
      chartColor={chartColor}
      interval={chartInterval}
      formatTooltipItems={payload => [
        {
          label: t('apyChart.tooltipItemLabels.date'),
          value: formatDate(payload.blockTimestamp, selectedPeriod),
        },
        {
          label: apyLabel,
          value: formatPercentageToReadableValue(payload[apyDataKey]),
        },
        {
          label: balanceLabel,
          value: formatCentsToReadableValue({
            value: payload[balanceDataKey],
          }),
        },
      ]}
    />
  );
};
