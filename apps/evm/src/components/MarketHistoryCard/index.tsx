import type { MarketHistoryPeriodType } from 'clients/api';
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

import { useTranslation } from 'libs/translations';
import { ApyChart } from './ApyChart';

export interface MarketHistoryCardPeriodOption {
  label: string;
  value: MarketHistoryPeriodType;
}

export interface MarketHistoryCardHistory {
  type: 'supply' | 'borrow';
  data: MarketHistoryDataPoint[];
  isLoading: boolean;
  selectedPeriod: MarketHistoryPeriodType;
  setSelectedPeriod: (period: MarketHistoryPeriodType) => void;
  periodOptions: MarketHistoryCardPeriodOption[];
}

export interface MarketHistoryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  cells: CellProps[];
  cap: CapProgressCircleProps;
  history?: MarketHistoryCardHistory;
}

export const MarketHistoryCard: React.FC<MarketHistoryCardProps> = ({
  title,
  cells,
  cap,
  history,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const isApyChartsFeatureEnabled = useIsFeatureEnabled({ name: 'apyCharts' });

  const averageApy =
    history && history.data.length > 0
      ? history.data.reduce((acc, item) => acc + item.apyPercentage, 0) / history.data.length
      : undefined;

  const marketCardCells: CellProps[] = [];

  if (averageApy && history) {
    marketCardCells.push({
      label: t('market.stats.averageApy'),
      value: formatPercentageToReadableValue(averageApy),
    });
  }

  marketCardCells.push(...cells);

  const shouldDisplayHistory = isApyChartsFeatureEnabled && !!history && history.data.length > 0;

  return (
    <MarketCard
      title={title}
      cells={marketCardCells}
      legends={
        shouldDisplayHistory
          ? [
              {
                label:
                  history.type === 'supply'
                    ? t('market.legends.supplyApy')
                    : t('market.legends.borrowApy'),
                color: history.type === 'supply' ? 'green' : 'red',
              },
            ]
          : undefined
      }
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
