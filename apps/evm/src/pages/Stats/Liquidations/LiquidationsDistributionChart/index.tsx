import { theme } from '@venusprotocol/ui';
import {
  type ApiRiskDashboardLiquidationsDistributionRow,
  type LiquidationsDistributionAxis,
  useGetRiskDashboardLiquidationsDistribution,
} from 'clients/api';
import { Card, Spinner } from 'components';
import { useGetVTokens } from 'libs/tokens/hooks/useGetVTokens';
import { useTranslation } from 'libs/translations';
import { useMemo } from 'react';
import {
  Bar,
  CartesianGrid,
  Cell,
  BarChart as RCBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCentsToReadableValue, truncateAddress } from 'utilities';
import { getAddress } from 'viem';
import { roundUpToScale } from '../../roundUpToScale';
import { useMarketColors } from '../../useMarketColors';

interface ChartDatum {
  marketAddress: string;
  symbol: string;
  valueDollars: number;
  count: string;
  valueUsdCents: string;
}

const toDollars = (cents: string) => Number(cents) / 100;

const buildChartData = (
  rows: ApiRiskDashboardLiquidationsDistributionRow[],
  symbolByMarket: Map<string, string>,
): ChartDatum[] =>
  [...rows]
    .sort((a, b) => Number(b.valueUsdCents) - Number(a.valueUsdCents))
    .map(row => ({
      marketAddress: row.marketAddress,
      symbol: symbolByMarket.get(row.marketAddress) ?? truncateAddress(row.marketAddress),
      valueDollars: toDollars(row.valueUsdCents),
      count: row.count,
      valueUsdCents: row.valueUsdCents,
    }));

interface TooltipPayloadItem {
  payload: ChartDatum;
}

const DistributionTooltip: React.FC<{
  active?: boolean;
  payload?: TooltipPayloadItem[];
}> = ({ active, payload }) => {
  const { t } = useTranslation();

  if (!active || !payload || payload.length === 0) {
    return null;
  }
  const datum = payload[0].payload;

  return (
    <div className="p-3 rounded-lg bg-background border border-lightGrey min-w-[200px]">
      <p className="text-b2s text-white mb-2">{datum.symbol}</p>
      <div className="flex items-center justify-between gap-3">
        <span className="text-b2r text-grey">
          {t('statsPage.liquidations.distributionChart.tooltip.value')}
        </span>
        <span className="text-b2s text-white">
          {formatCentsToReadableValue({ value: datum.valueUsdCents })}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-b2r text-grey">
          {t('statsPage.liquidations.distributionChart.tooltip.count')}
        </span>
        <span className="text-b2s text-white">{datum.count}</span>
      </div>
    </div>
  );
};

export interface LiquidationsDistributionChartProps {
  days: number;
  by: LiquidationsDistributionAxis;
}

export const LiquidationsDistributionChart: React.FC<LiquidationsDistributionChartProps> = ({
  days,
  by,
}) => {
  const { t } = useTranslation();
  const vTokens = useGetVTokens();
  const { data, isLoading, isError } = useGetRiskDashboardLiquidationsDistribution({ days, by });
  const { colorByMarket } = useMarketColors();

  const symbolByMarket = useMemo(() => {
    const map = new Map<string, string>();
    for (const vToken of vTokens) {
      map.set(getAddress(vToken.address), vToken.underlyingToken.symbol);
    }
    return map;
  }, [vTokens]);

  const chartData = useMemo(
    () => (data ? buildChartData(data.rows, symbolByMarket) : []),
    [data, symbolByMarket],
  );

  // t('statsPage.liquidations.distributionChart.byCollateralTitle')
  // t('statsPage.liquidations.distributionChart.byDebtTitle')
  const title = t(
    by === 'collateral'
      ? 'statsPage.liquidations.distributionChart.byCollateralTitle'
      : 'statsPage.liquidations.distributionChart.byDebtTitle',
  );

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-h6 text-white mb-4">{title}</h2>

      <div className="w-full h-100 flex items-center justify-center">
        {isLoading ? (
          <Spinner />
        ) : isError || !data ? (
          <p className="text-grey">{t('statsPage.liquidations.distributionChart.unavailable')}</p>
        ) : chartData.length === 0 ? (
          <p className="text-grey">{t('statsPage.liquidations.distributionChart.noData')}</p>
        ) : (
          <ResponsiveContainer>
            <RCBarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 8, left: 8, right: 16, bottom: 0 }}
            >
              <CartesianGrid
                stroke={theme.colors.lightGrey}
                strokeOpacity={0.3}
                horizontal={false}
              />

              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                stroke={theme.colors.grey}
                domain={[0, roundUpToScale]}
                tickFormatter={(value: number) =>
                  formatCentsToReadableValue({ value: Math.round(value * 100) })
                }
              />

              <YAxis
                type="category"
                dataKey="symbol"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                width={72}
                stroke={theme.colors.grey}
                tick={{ fill: theme.colors.white, fontSize: 12 }}
              />

              <Tooltip
                cursor={{ fill: theme.colors.lightGrey, fillOpacity: 0.1 }}
                content={<DistributionTooltip />}
              />

              <Bar dataKey="valueDollars" radius={[0, 4, 4, 0]}>
                {chartData.map(datum => (
                  <Cell
                    key={datum.marketAddress}
                    fill={colorByMarket[datum.marketAddress] ?? theme.colors.red}
                  />
                ))}
              </Bar>
            </RCBarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
