import {
  ButtonGroup,
  CapProgressCircle,
  type CapProgressCircleProps,
  type CellProps,
  MarketCard,
  Spinner,
} from 'components';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import type { MarketHistoryDataPoint } from 'types';
import { formatPercentageToReadableValue } from 'utilities';
import type { ChartHistoryPeriod } from 'utilities/formatToReadableDate';

import { useTranslation } from 'libs/translations';
import { ApyChart } from './ApyChart';

export interface MarketHistoryCardPeriodOption<
  TPeriod extends ChartHistoryPeriod = ChartHistoryPeriod,
> {
  label: string;
  value: TPeriod;
}

export interface MarketHistoryCardHistory<TPeriod extends ChartHistoryPeriod = ChartHistoryPeriod> {
  type: 'supply' | 'borrow';
  data: MarketHistoryDataPoint[];
  isLoading: boolean;
  selectedPeriod: TPeriod;
  setSelectedPeriod: (period: TPeriod) => void;
  periodOptions: MarketHistoryCardPeriodOption<TPeriod>[];
}

export interface MarketHistoryCardProps<TPeriod extends ChartHistoryPeriod = ChartHistoryPeriod>
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  cells: CellProps[];
  cap: CapProgressCircleProps;
  history?: MarketHistoryCardHistory<TPeriod>;
}

export const MarketHistoryCard = <TPeriod extends ChartHistoryPeriod = ChartHistoryPeriod>({
  title,
  cells,
  cap,
  history,
  ...otherProps
}: MarketHistoryCardProps<TPeriod>) => {
  const { t } = useTranslation();
  const isApyChartsFeatureEnabled = useIsFeatureEnabled({ name: 'apyCharts' });

  let averageApy: number | undefined;

  if (history && history.data.length > 0) {
    const apyDataKey = history.type === 'supply' ? 'supplyApyPercentage' : 'borrowApyPercentage';
    averageApy =
      history.data.reduce((acc, item) => acc + (item[apyDataKey] ?? 0), 0) / history.data.length;
  }

  const marketCardCells: CellProps[] = [];

  if (averageApy && history) {
    marketCardCells.push({
      label: t('market.stats.averageApy'),
      value: formatPercentageToReadableValue(averageApy),
    });
  }

  marketCardCells.push(...cells);

  const shouldDisplayHistory = isApyChartsFeatureEnabled && !!history && history.data.length > 0;
  const legends: { label: string; color: 'green' | 'red' }[] = [];

  if (shouldDisplayHistory && history) {
    const isSupplyHistory = history.type === 'supply';

    legends.push({
      label: isSupplyHistory ? t('market.legends.supplyApy') : t('market.legends.borrowApy'),
      color: isSupplyHistory ? 'green' : 'red',
    });
  }

  const marketCardLegends = legends.length > 0 ? legends : undefined;

  return (
    <MarketCard
      title={title}
      cells={marketCardCells}
      legends={marketCardLegends}
      topContent={<CapProgressCircle {...cap} />}
      rightContent={
        shouldDisplayHistory ? (
          <ButtonGroup
            buttonSize="xs"
            buttonLabels={history.periodOptions.map(periodOption => periodOption.label)}
            activeButtonIndex={history.periodOptions.findIndex(
              periodOption => periodOption.value === history.selectedPeriod,
            )}
            onButtonClick={index => {
              const periodOption = history.periodOptions[index];

              if (periodOption) {
                history.setSelectedPeriod(periodOption.value);
              }
            }}
          />
        ) : undefined
      }
      {...otherProps}
    >
      {history?.isLoading && history.data.length === 0 && <Spinner />}

      {shouldDisplayHistory && (
        <ApyChart data={history.data} type={history.type} selectedPeriod={history.selectedPeriod} />
      )}
    </MarketCard>
  );
};
