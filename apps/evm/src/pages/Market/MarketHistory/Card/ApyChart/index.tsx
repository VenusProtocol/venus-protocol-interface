import { theme } from '@venusprotocol/ui';
import type BigNumber from 'bignumber.js';

import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue, formatPercentageToReadableValue } from 'utilities';

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

  const formatToReadableDate = (timestampMs: number, selectedPeriod?: MarketHistoryPeriodType) => {
    if (selectedPeriod === 'year') {
      return t('apyChart.date.short', {
        date: new Date(timestampMs),
      });
    }

    return t('apyChart.date.full', {
      date: new Date(timestampMs),
    });
  };

  const chartColor = type === 'supply' ? theme.colors.green : theme.colors.red;
  const chartInterval = isSmOrUp ? 5 : 4;

  return (
    <AreaChart
      data={data}
      xAxisDataKey="timestampMs"
      yAxisDataKey="apyPercentage"
      className={className}
      formatXAxisValue={value => formatToReadableDate(value)}
      formatYAxisValue={formatPercentageToReadableValue}
      chartColor={chartColor}
      interval={chartInterval}
      formatTooltipItems={payload => [
        {
          label: t('apyChart.tooltipItemLabels.date'),
          value: formatToReadableDate(payload.timestampMs, selectedPeriod),
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
