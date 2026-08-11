import { theme } from '@venusprotocol/ui';

import type { LiquidityHubHistoryPeriod } from 'clients/api';
import { AreaChart } from 'components';
import { useBreakpointUp } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import type { LiquidityHubSnapshot } from 'types';
import { formatToReadableDate } from 'utilities';
import { formatUnitPriceToReadableValue } from '../formatUnitPriceToReadableValue';

export interface UnitPriceChartProps {
  data: LiquidityHubSnapshot[];
  selectedPeriod: LiquidityHubHistoryPeriod;
  className?: string;
}

export const UnitPriceChart: React.FC<UnitPriceChartProps> = ({
  className,
  data,
  selectedPeriod,
}) => {
  const { t } = useTranslation();
  const isSmOrUp = useBreakpointUp('sm');

  const formatDate = (timestampMs: number, period?: LiquidityHubHistoryPeriod) =>
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
      yAxisDataKey="pricePerShare"
      className={className}
      formatXAxisValue={formatDate}
      formatYAxisValue={formatUnitPriceToReadableValue}
      chartColor={theme.colors.blue}
      interval={chartInterval}
      formatTooltipItems={payload => [
        {
          label: t('apyChart.tooltipItemLabels.date'),
          value: formatDate(payload.blockTimestamp, selectedPeriod),
        },
        {
          label: t('apyChart.tooltipItemLabels.unitPrice'),
          value: formatUnitPriceToReadableValue(payload.pricePerShare),
        },
      ]}
    />
  );
};
