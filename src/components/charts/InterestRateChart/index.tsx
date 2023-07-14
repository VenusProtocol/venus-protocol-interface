/** @jsxImportSource @emotion/react */
import React from 'react';
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
import { useTranslation } from 'translation';
import { formatPercentageToReadableValue } from 'utilities';

import TooltipContent from '../TooltipContent';
import { useStyles as useSharedStyles } from '../styles';
import { useStyles as useLocalStyles } from './styles';

export interface InterestRateItem {
  utilizationRate: number;
  borrowApyPercentage: number;
  supplyApyPercentage: number;
}

export interface InterestRateChartProps {
  data: InterestRateItem[];
  currentUtilizationRate?: number;
  className?: string;
}

export const InterestRateChart: React.FC<InterestRateChartProps> = ({
  className,
  currentUtilizationRate,
  data,
}) => {
  const sharedStyles = useSharedStyles();
  const localStyles = useLocalStyles();

  const { t } = useTranslation();

  return (
    <div css={sharedStyles.container} className={className}>
      <ResponsiveContainer>
        <LineChart data={data} margin={sharedStyles.chartMargin}>
          <XAxis
            dataKey="utilizationRate"
            axisLine={false}
            tickLine={false}
            tickFormatter={formatPercentageToReadableValue}
            stroke={sharedStyles.accessoryColor}
            tickMargin={sharedStyles.tickMargin}
            tickCount={5}
            type="number"
            style={sharedStyles.axis}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={formatPercentageToReadableValue}
            tickMargin={sharedStyles.tickMargin}
            stroke={sharedStyles.accessoryColor}
            style={sharedStyles.axis}
            tickCount={10}
          />
          <Tooltip
            isAnimationActive={false}
            cursor={sharedStyles.cursor}
            content={({ payload }) =>
              payload && payload[0] ? (
                <TooltipContent
                  items={[
                    {
                      label: t('interestRateChart.tooltipItemLabels.utilizationRate'),
                      value: formatPercentageToReadableValue(
                        (payload[0].payload as InterestRateItem).utilizationRate,
                      ),
                    },
                    {
                      label: t('interestRateChart.tooltipItemLabels.borrowApy'),
                      value: formatPercentageToReadableValue(
                        (payload[0].payload as InterestRateItem).borrowApyPercentage,
                      ),
                    },
                    {
                      label: t('interestRateChart.tooltipItemLabels.supplyApy'),
                      value: formatPercentageToReadableValue(
                        (payload[0].payload as InterestRateItem).supplyApyPercentage,
                      ),
                    },
                  ]}
                />
              ) : null
            }
          />
          <CartesianGrid vertical={false} stroke={sharedStyles.gridLineColor} />
          <Line
            type="monotone"
            dataKey="borrowApyPercentage"
            stroke={localStyles.lineBorrowApyColor}
            strokeWidth={sharedStyles.lineStrokeWidth}
            isAnimationActive={false}
            activeDot={localStyles.lineActiveDot}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="supplyApyPercentage"
            stroke={localStyles.lineSupplyApyColor}
            strokeWidth={sharedStyles.lineStrokeWidth}
            activeDot={localStyles.lineActiveDot}
            isAnimationActive={false}
            dot={false}
          />
          {typeof currentUtilizationRate === 'number' && (
            <ReferenceLine
              x={currentUtilizationRate}
              stroke={localStyles.referenceLineColor}
              // Note: we can not use the spread operator to extend
              // styles.referenceLineLabel because its type is not accepted for
              // that
              label={Object.assign(localStyles.referenceLineLabel || {}, {
                value: t('interestRateChart.currentUtilizationRateLabelValue', {
                  percentage: formatPercentageToReadableValue(currentUtilizationRate),
                }),
              })}
              alwaysShow
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
