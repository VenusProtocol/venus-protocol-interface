import { Spinner, cn, theme } from '@venusprotocol/ui';
import {
  type AccountPerformanceHistoryDataPoint,
  type AccountPerformanceHistoryPeriod,
  useGetAccountPerformanceHistory,
} from 'clients/api';
import { ButtonGroup, Card, Cell, type CellProps, ErrorState, Icon, InfoIcon } from 'components';
import { AreaChart } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { useBreakpointUp } from 'hooks/responsive';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useState } from 'react';
import { formatCentsToReadableValue, formatPercentageToReadableValue } from 'utilities';
import { DollarValueChange } from './DollarValueChange';

export interface PerformanceChartProps {
  netWorthCents: number;
  className?: string;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ className, netWorthCents }) => {
  const { t } = useTranslation();
  const isSmOrUp = useBreakpointUp('sm');
  const { accountAddress } = useAccountAddress();
  const isVaiFeatureEnabled = useIsFeatureEnabled({
    name: 'vaiRoute',
  });

  const periodOptions: { label: string; value: AccountPerformanceHistoryPeriod }[] = [
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

  const [selectedPeriod, setSelectedPeriod] = useState<AccountPerformanceHistoryPeriod>(
    periodOptions[0].value,
  );

  const {
    data: getAccountPerformanceHistoryData,
    refetch: refetchAccountPerformanceHistoryData,
    error: getAccountPerformanceHistoryError,
    isLoading: isGetAccountPerformanceHistoryLoading,
  } = useGetAccountPerformanceHistory({
    accountAddress: accountAddress || NULL_ADDRESS,
    period: selectedPeriod,
  });
  const accountPerformanceHistory = getAccountPerformanceHistoryData?.performanceHistory || [];

  const startOfDayNetWorthCents =
    getAccountPerformanceHistoryData?.startOfDayNetWorthCents !== undefined
      ? getAccountPerformanceHistoryData?.startOfDayNetWorthCents
      : undefined;

  const oldestNetWorthCents =
    accountPerformanceHistory.length > 0
      ? Number(accountPerformanceHistory[0].netWorthCents)
      : undefined;

  const absolutePerformanceCents =
    oldestNetWorthCents !== undefined ? netWorthCents - oldestNetWorthCents : undefined;

  const dailyChangeCents =
    startOfDayNetWorthCents !== undefined ? netWorthCents - startOfDayNetWorthCents : undefined;

  const dailyChangePercentage =
    dailyChangeCents !== undefined && netWorthCents !== 0
      ? (dailyChangeCents * 100) / netWorthCents
      : undefined;

  let readableDailyChangePercentage = formatPercentageToReadableValue(dailyChangePercentage);
  // Remove "-" sign
  if (readableDailyChangePercentage[0] === '-') {
    readableDailyChangePercentage = readableDailyChangePercentage.substring(1);
  }

  const [selectedDataPoint, setSelectedDataPoint] = useState<
    AccountPerformanceHistoryDataPoint | undefined
  >();

  const chartInterval = isSmOrUp ? 5 : 4;

  const cells: CellProps[] = [
    {
      label: t('account.performanceChart.todaysChange'),
      value: (
        <div className="space-x-2 flex items-center">
          <DollarValueChange value={dailyChangeCents} />

          {dailyChangeCents !== undefined && dailyChangeCents !== 0 && (
            <div
              className={cn('flex items-center', dailyChangeCents > 0 ? 'text-green' : 'text-red')}
            >
              <Icon
                name="arrowUpFull2"
                className={cn('w-4 h-4 text-inherit', dailyChangeCents < 0 && 'rotate-180')}
              />

              <span>{readableDailyChangePercentage}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      label: t('account.performanceChart.absolutePerformance'),
      value: <DollarValueChange value={absolutePerformanceCents} />,
    },
  ];

  return (
    <Card className={cn('rounded-2xl', className)}>
      <div className="flex justify-between mb-4 sm:mb-2">
        <div className="flex flex-col grow sm:flex-row sm:gap-x-2 sm:items-end">
          <div className="sm:mb-2 sm:order-2">
            {selectedDataPoint ? (
              <p className="text-sm">
                {t('account.performanceChart.dataPoint.date', {
                  date: new Date(selectedDataPoint.blockTimestampMs),
                })}
              </p>
            ) : (
              <div className="flex gap-x-1 items-center">
                <p className="text-sm text-grey">{t('account.performanceChart.netWorth.label')}</p>

                <InfoIcon
                  className="inline-flex"
                  tooltip={
                    isVaiFeatureEnabled
                      ? t('account.performanceChart.netWorth.tooltipWithVai')
                      : t('account.performanceChart.netWorth.tooltip')
                  }
                />
              </div>
            )}
          </div>

          <p className="text-xl sm:text-2xl sm:order-1">
            {formatCentsToReadableValue({
              value: selectedDataPoint ? Number(selectedDataPoint.netWorthCents) : netWorthCents,
            })}
          </p>
        </div>

        <div>
          <ButtonGroup
            buttonSize="xs"
            buttonLabels={periodOptions.map(p => p.label)}
            activeButtonIndex={periodOptions.findIndex(p => p.value === selectedPeriod)}
            onButtonClick={index => setSelectedPeriod(periodOptions[index].value)}
            buttonClassName="min-w-fit"
          />
        </div>
      </div>

      <div className="flex mb-8">
        {cells.map(cell => (
          <Cell
            {...cell}
            key={cell.label}
            className={cn(
              'border-r border-r-lightGrey px-5 first-of-type:pl-0 last-of-type:pr-0 last-of-type:border-r-0',
              cell.className,
            )}
          />
        ))}
      </div>

      <div className="h-50">
        {accountPerformanceHistory.length > 0 && (
          <AreaChart
            data={accountPerformanceHistory}
            xAxisDataKey="blockTimestampMs"
            yAxisDataKey="netWorthCents"
            yAxisTickCount={5}
            onDataPointHover={payload => setSelectedDataPoint(payload)}
            onMouseLeave={() => setSelectedDataPoint(undefined)}
            formatXAxisValue={timestampMs =>
              t('account.performanceChart.xAxisValue', {
                date: new Date(timestampMs),
              })
            }
            formatYAxisValue={value => formatCentsToReadableValue({ value })}
            interval={chartInterval}
            chartColor={theme.colors.blue}
            className="h-full"
          />
        )}

        {accountPerformanceHistory.length === 0 &&
          (isGetAccountPerformanceHistoryLoading || getAccountPerformanceHistoryError) && (
            <div className="w-full h-full flex flex-col items-center justify-center gap-y-3">
              {getAccountPerformanceHistoryError ? (
                <ErrorState
                  message={t('account.performanceChart.errorState.failedToFetchMessage')}
                  button={{
                    label: t('account.performanceChart.errorState.refetchButtonLabel'),
                    onClick: refetchAccountPerformanceHistoryData,
                  }}
                />
              ) : (
                <>
                  <Spinner className="h-auto" />

                  <p className="text-sm text-grey">
                    {t('account.performanceChart.placeholderText')}
                  </p>
                </>
              )}
            </div>
          )}
      </div>
    </Card>
  );
};
