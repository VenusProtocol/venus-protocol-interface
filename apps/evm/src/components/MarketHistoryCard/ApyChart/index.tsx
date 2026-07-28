import { theme } from '@venusprotocol/ui';

import type { MarketHistoryPeriodType } from 'clients/api';
import { AreaChart } from 'components';
import { useBreakpointUp } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import type { MarketHistoryDataPoint } from 'types';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatToReadableDate,
} from 'utilities';

export interface ApyChartProps {
  data: MarketHistoryDataPoint[];
  type: 'supply' | 'borrow';
  selectedPeriod: MarketHistoryPeriodType;
  className?: string;
}

export const ApyChart: React.FC<ApyChartProps> = ({ className, data, type, selectedPeriod }) => {
  const { t } = useTranslation();
  const isSmOrUp = useBreakpointUp('sm');

  const formatDate = (timestampMs: number, period?: MarketHistoryPeriodType) =>
    formatToReadableDate({
      timestampMs,
      selectedPeriod: period,
      t,
    });

  const chartColor = type === 'supply' ? theme.colors.green : theme.colors.red;
  const chartInterval = isSmOrUp ? 5 : 3;

  return (
    <AreaChart
      data={data}
      xAxisDataKey="timestampMs"
      yAxisDataKey="apyPercentage"
      className={className}
      formatXAxisValue={formatDate}
      formatYAxisValue={formatPercentageToReadableValue}
      chartColor={chartColor}
      interval={chartInterval}
      formatTooltipItems={payload => [
        {
          label: t('apyChart.tooltipItemLabels.date'),
          value: formatDate(payload.timestampMs, selectedPeriod),
        },
        {
          label:
            type === 'supply'
              ? t('apyChart.tooltipItemLabels.supplyApy')
              : t('apyChart.tooltipItemLabels.borrowApy'),
          value: formatPercentageToReadableValue(payload.apyPercentage),
        },
        {
          label:
            type === 'supply'
              ? t('apyChart.tooltipItemLabels.totalSupply')
              : t('apyChart.tooltipItemLabels.totalBorrow'),
          value: formatCentsToReadableValue({
            value: payload.balanceCents,
          }),
        },
      ]}
    />
  );
};
