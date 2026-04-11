import { theme } from '@venusprotocol/ui';
import type BigNumber from 'bignumber.js';

import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue, formatToReadableDate } from 'utilities';

import type { MarketHistoryPeriodType } from 'clients/api';
import { AreaChart } from 'components';
import { useBreakpointUp } from 'hooks/responsive';

export interface ApyChartItem {
  apyPercentage: number;
  timestampMs: number;
  balanceCents: BigNumber;
}

export interface ApyChartProps {
  data: ApyChartItem[];
  selectedPeriod: MarketHistoryPeriodType;
  className?: string;
}

export const SupplyChart: React.FC<ApyChartProps> = ({ className, data, selectedPeriod }) => {
  const { t } = useTranslation();
  const isSmOrUp = useBreakpointUp('sm');

  const formatDate = (timestampMs: number, period?: MarketHistoryPeriodType) =>
    formatToReadableDate({
      timestampMs,
      selectedPeriod: period,
      t,
    });

  const chartInterval = isSmOrUp ? 5 : 3;

  const formattedData = (data ?? []).map(item => ({
    ...item,
    balanceNum: item.balanceCents.toNumber(),
  }));

  return (
    <AreaChart
      data={formattedData}
      xAxisDataKey="timestampMs"
      yAxisDataKey="balanceNum"
      className={className}
      formatXAxisValue={value => formatDate(value)}
      formatYAxisValue={value =>
        formatCentsToReadableValue({
          value,
        })
      }
      chartColor={theme.colors.green}
      interval={chartInterval}
      formatTooltipItems={payload => [
        {
          label: t('apyChart.tooltipItemLabels.date'),
          value: formatDate(payload.timestampMs, selectedPeriod),
        },
        {
          label: t('apyChart.tooltipItemLabels.totalStaked'),
          value: formatCentsToReadableValue({
            value: payload.balanceCents,
          }),
        },
      ]}
    />
  );
};
