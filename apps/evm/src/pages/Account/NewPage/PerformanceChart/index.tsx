import { cn, theme } from '@venusprotocol/ui';
import type { MarketHistoryPeriodType } from 'clients/api';
import { ButtonGroup, Card, Cell, type CellProps, InfoIcon } from 'components';
import { AreaChart } from 'components';
import { useBreakpointUp } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import { formatCentsToReadableValue } from 'utilities';
import { data } from './fakeData';
import { formatToReadableAxisDate } from './formatToReadableAxisDate';
import { formatToReadableTitleDate } from './formatToReadableTitleDate';

export interface PerformanceChartProps {
  className?: string;
}

interface PerformanceChartItem {
  timestampMs: number;
  netWorthCents: number;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ className }) => {
  const { t } = useTranslation();
  const isSmOrUp = useBreakpointUp('sm');

  const periodOptions: { label: string; value: MarketHistoryPeriodType }[] = [
    {
      label: t('account.performanceChart.periodOption.thirtyDays'),
      value: 'month',
    },
    {
      label: t('account.performanceChart.periodOption.sixMonths'),
      value: 'halfyear',
    },
    {
      label: t('account.performanceChart.periodOption.oneYear'),
      value: 'year',
    },
  ];

  const [selectedPeriod, setSelectedPeriod] = useState<MarketHistoryPeriodType>(
    periodOptions[0].value,
  );

  const [selectedDataPoint, setSelectedDataPoint] = useState<PerformanceChartItem | undefined>();

  const chartInterval = isSmOrUp ? 5 : 4;
  const netWorthCents = 1000000; // TODO: fetch current user net worth

  const cells: CellProps[] = [
    {
      label: t('account.performanceChart.dailyChange'),
      value: <span className="text-base sm:text-lg">+$100</span>,
    },
    {
      label: t('account.performanceChart.absolutePerformance'),
      // TODO: calculate based on selected data point
      value: <span className="text-base sm:text-lg">+$100</span>,
    },
  ];

  return (
    <Card className={className}>
      <div className="flex justify-between mb-4 sm:mb-2">
        <div className="flex flex-col grow sm:flex-row sm:gap-x-2 sm:items-end">
          <div className="sm:mb-2 sm:order-2">
            {selectedDataPoint ? (
              <p className="text-sm">
                {formatToReadableTitleDate({ timestampMs: selectedDataPoint.timestampMs })}
              </p>
            ) : (
              <div className="flex gap-x-1 items-center">
                <p className="text-sm text-grey">{t('account.performanceChart.netWorth.label')}</p>

                <InfoIcon
                  className="inline-flex"
                  tooltip={t('account.performanceChart.netWorth.tooltip')}
                />
              </div>
            )}
          </div>

          <p className="text-xl sm:text-2xl sm:order-1">
            {formatCentsToReadableValue({
              value: selectedDataPoint?.netWorthCents || netWorthCents,
            })}
          </p>
        </div>

        <div>
          <ButtonGroup
            buttonLabels={periodOptions.map(p => p.label)}
            activeButtonIndex={periodOptions.findIndex(p => p.value === selectedPeriod)}
            onButtonClick={index => setSelectedPeriod(periodOptions[index].value)}
          />
        </div>
      </div>

      <div className="flex mb-8">
        {cells.map(cell => (
          <Cell
            {...cell}
            key={cell.label}
            small
            className={cn(
              'border-r border-r-lightGrey px-5 first-of-type:pl-0 last-of-type:pr-0 last-of-type:border-r-0',
              cell.className,
            )}
          />
        ))}
      </div>

      <AreaChart
        data={data} // TODO: fetch actual data
        xAxisDataKey="timestampMs"
        yAxisDataKey="netWorthCents"
        onDataPointHover={payload => setSelectedDataPoint(payload)}
        onMouseLeave={() => setSelectedDataPoint(undefined)}
        formatXAxisValue={formatToReadableAxisDate}
        formatYAxisValue={value => formatCentsToReadableValue({ value })}
        interval={chartInterval}
        chartColor={theme.colors.blue}
        className="h-50"
      />
    </Card>
  );
};
