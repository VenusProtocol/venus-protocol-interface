import { Spinner, cn, theme } from '@venusprotocol/ui';

import type { AccountPerformanceHistoryDataPoint } from 'clients/api';
import { ErrorState } from 'components';
import { AreaChart, type AreaChartProps } from 'components';
import { useBreakpointUp } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue } from 'utilities';

export interface PerformanceChartProps
  extends Partial<AreaChartProps<AccountPerformanceHistoryDataPoint>> {
  accountPerformanceHistory: AccountPerformanceHistoryDataPoint[];
  onSelectedDataPointChange?: (dataPoint: AccountPerformanceHistoryDataPoint | undefined) => void;
  onRefetch?: () => void;
  error?: Error;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  className,
  onSelectedDataPointChange,
  onRefetch,
  accountPerformanceHistory,
  error,
  ...areaChartProps
}) => {
  const { t } = useTranslation();
  const isSmOrUp = useBreakpointUp('sm');

  const chartInterval = isSmOrUp ? 5 : 3;

  return (
    <div className={cn('h-43', className)}>
      {accountPerformanceHistory.length > 0 && (
        <AreaChart
          data={accountPerformanceHistory}
          xAxisDataKey="blockTimestampMs"
          yAxisDataKey="netWorthCents"
          yAxisTickCount={5}
          onDataPointHover={payload => onSelectedDataPointChange?.(payload)}
          onMouseLeave={() => onSelectedDataPointChange?.(undefined)}
          formatXAxisValue={timestampMs =>
            t('dashboard.performanceChart.xAxisValue', {
              date: new Date(timestampMs),
            })
          }
          formatYAxisValue={value => formatCentsToReadableValue({ value })}
          interval={chartInterval}
          chartColor={theme.colors['blue-active']}
          className="h-full"
          {...areaChartProps}
        />
      )}

      {accountPerformanceHistory.length === 0 && onRefetch && (
        <div className="w-full h-full flex flex-col items-center justify-center gap-y-3">
          {error ? (
            <ErrorState
              message={t('dashboard.overview.performanceChart.errorState.failedToFetchMessage')}
              button={{
                label: t('dashboard.overview.performanceChart.errorState.refetchButtonLabel'),
                onClick: onRefetch,
              }}
            />
          ) : (
            <>
              <Spinner className="h-auto" />

              <p className="text-sm text-grey">
                {t('dashboard.overview.performanceChart.placeholderText')}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
