import { Spinner, cn, theme } from '@venusprotocol/ui';
import {
  type AccountNetWorthHistoryDataPoint,
  type AccountNetWorthHistoryPeriod,
  useGetAccountNetWorthHistory,
} from 'clients/api';
import { ButtonGroup, Card, Cell, type CellProps, InfoIcon } from 'components';
import { AreaChart } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { useBreakpointUp } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useState } from 'react';
import { formatCentsToReadableValue } from 'utilities';
import { formatToReadableAxisDate } from './formatToReadableAxisDate';
import { formatToReadableTitleDate } from './formatToReadableTitleDate';

export interface PerformanceChartProps {
  netWorthCents: number;
  className?: string;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ className, netWorthCents }) => {
  const { t } = useTranslation();
  const isSmOrUp = useBreakpointUp('sm');
  const { accountAddress } = useAccountAddress();

  const periodOptions: { label: string; value: AccountNetWorthHistoryPeriod }[] = [
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

  const [selectedPeriod, setSelectedPeriod] = useState<AccountNetWorthHistoryPeriod>(
    periodOptions[0].value,
  );

  const { data: getAccountNetWorthHistoryData } = useGetAccountNetWorthHistory({
    accountAddress: accountAddress || NULL_ADDRESS,
    period: selectedPeriod,
  });
  const accountNetWorthHistory = getAccountNetWorthHistoryData?.accountNetWorthHistory || [];
  const oldestNetWorthCents =
    accountNetWorthHistory.length > 0 ? Number(accountNetWorthHistory[0].netWorthCents) : undefined;

  const absolutePerformanceCents =
    oldestNetWorthCents !== undefined ? netWorthCents - oldestNetWorthCents : undefined;

  const readableAbsolutePerformance = formatCentsToReadableValue({
    value: absolutePerformanceCents,
  });

  const [selectedDataPoint, setSelectedDataPoint] = useState<
    AccountNetWorthHistoryDataPoint | undefined
  >();

  const chartInterval = isSmOrUp ? 5 : 4;

  const cells: CellProps[] = [
    {
      label: t('account.performanceChart.dailyChange'),
      value: <span className="text-base sm:text-lg">+$100</span>,
    },
    {
      label: t('account.performanceChart.absolutePerformance'),
      value: (
        <span className="text-base sm:text-lg">
          {absolutePerformanceCents !== undefined && absolutePerformanceCents > 0 && '+'}
          {readableAbsolutePerformance}
        </span>
      ),
    },
  ];

  return (
    <Card className={cn('rounded-2xl', className)}>
      <div className="flex justify-between mb-4 sm:mb-2">
        <div className="flex flex-col grow sm:flex-row sm:gap-x-2 sm:items-end">
          <div className="sm:mb-2 sm:order-2">
            {selectedDataPoint ? (
              <p className="text-sm">
                {formatToReadableTitleDate({
                  timestampMs: Number(selectedDataPoint.blockTimestampMs),
                })}
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
              value: selectedDataPoint?.netWorthCents
                ? Number(selectedDataPoint.netWorthCents)
                : netWorthCents,
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

      {/* TODO: add loading state */}
      {accountNetWorthHistory.length > 0 ? (
        <AreaChart
          data={accountNetWorthHistory}
          xAxisDataKey="blockTimestampMs"
          yAxisDataKey="netWorthCents"
          onDataPointHover={payload => setSelectedDataPoint(payload)}
          onMouseLeave={() => setSelectedDataPoint(undefined)}
          formatXAxisValue={formatToReadableAxisDate}
          formatYAxisValue={value => formatCentsToReadableValue({ value })}
          interval={chartInterval}
          chartColor={theme.colors.blue}
          className="h-50"
        />
      ) : (
        <Spinner className="h-50" />
      )}
    </Card>
  );
};
