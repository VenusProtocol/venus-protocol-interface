import { cn, theme } from '@venusprotocol/ui';
import { useGetVTokenApySimulations } from 'clients/api';
import { ChartTooltipContent, ChartYAxisTick, Spinner } from 'components';
import { useTranslation } from 'libs/translations';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Asset } from 'types';
import { formatPercentageToReadableValue } from 'utilities';
import { MarketCard, type MarketCardProps } from '../MarketCard';
import TEST_IDS from '../testIds';
import { useStyles } from './styles';

export interface InterestRateItem {
  utilizationRatePercentage: number;
  borrowApyPercentage: number;
  supplyApyPercentage: number;
}

export interface InterestRateChartProps {
  className?: string;
  asset: Asset;
  isIsolatedPoolMarket: boolean;
}

export const InterestRateChart: React.FC<InterestRateChartProps> = ({
  asset,
  className,
  isIsolatedPoolMarket,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const {
    isLoading: isInterestRateChartDataLoading,
    data: interestRateChartData = {
      apySimulations: [],
      currentUtilizationRatePercentage: 0,
    },
  } = useGetVTokenApySimulations({
    isIsolatedPoolMarket,
    asset,
  });

  const legends: MarketCardProps['legends'] = [
    {
      label: t('market.legends.utilizationRate'),
      color: 'blue',
    },
    {
      label: t('market.legends.borrowApy'),
      color: 'red',
    },
    {
      label: t('market.legends.supplyApy'),
      color: 'green',
    },
  ];

  return (
    <MarketCard
      className={className}
      data-testid={TEST_IDS.interestRateModel}
      title={t('market.interestRateModel.title')}
      legends={legends}
    >
      {isInterestRateChartDataLoading && interestRateChartData.apySimulations.length === 0 && (
        <Spinner />
      )}

      {interestRateChartData.apySimulations.length > 0 && (
        <div className="-mr-[10px]">
          <div className={cn('w-full h-62', className)}>
            <ResponsiveContainer>
              <LineChart
                data={interestRateChartData.apySimulations}
                margin={{
                  top: 20,
                  right: 10,
                  left: -12,
                }}
              >
                <XAxis
                  dataKey="utilizationRatePercentage"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatPercentageToReadableValue}
                  stroke={theme.colors.grey}
                  tickMargin={10}
                  tickCount={5}
                  type="number"
                  className="text-xs"
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  tick={({ payload, y }) => (
                    <ChartYAxisTick value={formatPercentageToReadableValue(payload.value)} y={y} />
                  )}
                  stroke={theme.colors.grey}
                  className="text-xs"
                  tickCount={10}
                />

                <Tooltip
                  isAnimationActive={false}
                  cursor={{ strokeDasharray: '4px 4px', stroke: theme.colors.grey }}
                  content={({ payload }) =>
                    payload?.[0] ? (
                      <ChartTooltipContent
                        items={[
                          {
                            label: t('interestRateChart.tooltipItemLabels.utilizationRate'),
                            value: formatPercentageToReadableValue(
                              payload?.[0].payload.utilizationRatePercentage,
                            ),
                          },
                          {
                            label: t('interestRateChart.tooltipItemLabels.borrowApy'),
                            value: formatPercentageToReadableValue(
                              payload?.[0].payload.borrowApyPercentage,
                            ),
                          },
                          {
                            label: t('interestRateChart.tooltipItemLabels.supplyApy'),
                            value: formatPercentageToReadableValue(
                              payload?.[0].payload.supplyApyPercentage,
                            ),
                          },
                        ]}
                      />
                    ) : null
                  }
                />

                <CartesianGrid vertical={false} stroke={theme.colors.lightGrey} />

                <Line
                  type="monotone"
                  dataKey="borrowApyPercentage"
                  stroke={styles.lineBorrowApyColor}
                  strokeWidth={2}
                  isAnimationActive={false}
                  activeDot={styles.lineActiveDot}
                  dot={false}
                />

                <Line
                  type="monotone"
                  dataKey="supplyApyPercentage"
                  stroke={styles.lineSupplyApyColor}
                  strokeWidth={2}
                  activeDot={styles.lineActiveDot}
                  isAnimationActive={false}
                  dot={false}
                />

                {typeof interestRateChartData.currentUtilizationRatePercentage === 'number' && (
                  <ReferenceLine
                    x={interestRateChartData.currentUtilizationRatePercentage}
                    stroke={styles.referenceLineColor}
                    // Note: we can not use the spread operator to extend
                    // styles.referenceLineLabel because its type is not accepted for
                    // that
                    label={Object.assign(styles.referenceLineLabel || {}, {
                      value: t('interestRateChart.currentUtilizationRateLabelValue', {
                        percentage: formatPercentageToReadableValue(
                          interestRateChartData.currentUtilizationRatePercentage,
                        ),
                      }),
                    })}
                    alwaysShow
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </MarketCard>
  );
};
