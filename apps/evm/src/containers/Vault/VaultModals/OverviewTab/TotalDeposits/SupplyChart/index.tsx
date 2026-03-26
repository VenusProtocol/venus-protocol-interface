import { theme } from '@venusprotocol/ui';
import type BigNumber from 'bignumber.js';

import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue } from 'utilities';

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
      formatXAxisValue={value => formatToReadableDate(value)}
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
          value: formatToReadableDate(payload.timestampMs, selectedPeriod),
        },
        {
          label: t('apyChart.tooltipItemLabels.totalSupply'),
          value: formatCentsToReadableValue({
            value: payload.balanceCents,
          }),
        },
      ]}
    />
  );
};
