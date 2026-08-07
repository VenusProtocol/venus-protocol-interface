import { theme } from '@venusprotocol/ui';

import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue, formatToReadableDate } from 'utilities';

import type { MarketHistoryPeriodType } from 'clients/api';
import { AreaChart } from 'components';
import { useBreakpointUp } from 'hooks/responsive';
import type { MarketHistoryDataPoint } from 'types';

export interface ApyChartProps {
  data: MarketHistoryDataPoint[];
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

  return (
    <AreaChart
      data={data}
      xAxisDataKey="blockTimestamp"
      yAxisDataKey="totalSupplyCents"
      className={className}
      formatXAxisValue={formatDate}
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
          value: formatDate(payload.blockTimestamp, selectedPeriod),
        },
        {
          label: t('apyChart.tooltipItemLabels.totalStaked'),
          value: formatCentsToReadableValue({
            value: payload.totalSupplyCents,
          }),
        },
      ]}
    />
  );
};
