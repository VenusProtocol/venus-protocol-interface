import { cn, theme } from '@venusprotocol/ui';
import { useGetVTokenApySimulations } from 'clients/api';
import {
  ChartTooltipContent,
  ChartYAxisTick,
  MarketCard,
  type MarketCardProps,
  Spinner,
} from 'components';
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
import TEST_IDS from '../testIds';

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
        <div className="-mr-2.5">
          <div className={cn('h-62 w-full', className)}>
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
                  className="text-b2r"
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  tick={({ payload, y }) => (
                    <ChartYAxisTick value={formatPercentageToReadableValue(payload.value)} y={y} />
                  )}
                  stroke={theme.colors.grey}
                  className="text-b2r"
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

                <CartesianGrid
                  vertical={false}
                  stroke={theme.colors.lightGrey}
                  strokeDasharray="2 2"
                />

                <Line
                  type="monotone"
                  dataKey="borrowApyPercentage"
                  stroke={theme.colors.red}
                  strokeWidth={2}
                  isAnimationActive={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  dot={false}
                />

                <Line
                  type="monotone"
                  dataKey="supplyApyPercentage"
                  stroke={theme.colors.green}
                  strokeWidth={2}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  isAnimationActive={false}
                  dot={false}
                />

                {typeof interestRateChartData.currentUtilizationRatePercentage === 'number' && (
                  <ReferenceLine
                    x={interestRateChartData.currentUtilizationRatePercentage}
                    stroke={theme.colors.blue}
                    label={{
                      position: {
                        y: -10,
                        x: 48,
                      },
                      fill: theme.colors.white,
                      fontSize: 14,
                      fontWeight: 600,
                      value: t('interestRateChart.currentUtilizationRateLabelValue', {
                        percentage: formatPercentageToReadableValue(
                          interestRateChartData.currentUtilizationRatePercentage,
                        ),
                      }),
                    }}
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
