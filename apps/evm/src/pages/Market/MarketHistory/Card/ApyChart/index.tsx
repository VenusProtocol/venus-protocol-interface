import { theme } from '@venusprotocol/ui';
import type BigNumber from 'bignumber.js';

import { useTranslation } from 'libs/translations';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatToReadableDate,
} from 'utilities';

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
      formatXAxisValue={value => formatDate(value)}
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

export const SupplyApyChart: React.FC<Omit<ApyChartProps, 'type'>> = props => (
  <ApyChart type="supply" {...props} />
);

export const BorrowApyChart: React.FC<Omit<ApyChartProps, 'type'>> = props => (
  <ApyChart type="borrow" {...props} />
);
