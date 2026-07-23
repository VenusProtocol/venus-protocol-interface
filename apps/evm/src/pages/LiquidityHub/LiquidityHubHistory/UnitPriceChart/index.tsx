import { theme } from '@venusprotocol/ui';

import type { MarketHistoryPeriodType } from 'clients/api';
import { AreaChart } from 'components';
import { useBreakpointUp } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import { formatToReadableDate } from 'utilities';
import { formatUnitPriceToReadableValue } from '../formatUnitPriceToReadableValue';

export interface UnitPriceHistoryDataPoint {
  timestampMs: number;
  unitPrice: number;
}

export interface UnitPriceChartProps {
  data: UnitPriceHistoryDataPoint[];
  selectedPeriod: MarketHistoryPeriodType;
  className?: string;
}

export const UnitPriceChart: React.FC<UnitPriceChartProps> = ({
  className,
  data,
  selectedPeriod,
}) => {
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
      xAxisDataKey="timestampMs"
      yAxisDataKey="unitPrice"
      className={className}
      formatXAxisValue={formatDate}
      formatYAxisValue={formatUnitPriceToReadableValue}
      chartColor={theme.colors.blue}
      interval={chartInterval}
      formatTooltipItems={payload => [
        {
          label: t('apyChart.tooltipItemLabels.date'),
          value: formatDate(payload.timestampMs, selectedPeriod),
        },
        {
          label: t('apyChart.tooltipItemLabels.unitPrice'),
          value: formatUnitPriceToReadableValue(payload.unitPrice),
        },
      ]}
    />
  );
};
