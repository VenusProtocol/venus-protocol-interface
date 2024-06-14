import { useMemo, useState } from 'react';

import { ButtonGroup, Spinner } from 'components';
import { ApyChart, type ApyChartProps } from 'components/charts/ApyChart';
import { useTranslation } from 'libs/translations';
import type { Asset } from 'types';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  getCombinedDistributionApys,
} from 'utilities';

import { useGetPoolLiquidationIncentive } from 'clients/api';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { MarketCard, type MarketCardProps } from '../../MarketCard';
import { useGetLiquidationThresholdPercentage } from './useGetLiquidationThresholdPercentage';

const ENTRIES_PER_DAY = 1;
const ENTRIES_PER_30_DAYS = ENTRIES_PER_DAY * 30;
const ENTRIES_PER_6_MONTHS = ENTRIES_PER_30_DAYS * 6;
const ENTRIES_PER_YEAR = ENTRIES_PER_6_MONTHS * 2;

export interface CardProps {
  type: ApyChartProps['type'];
  asset: Asset;
  data: ApyChartProps['data'];
  poolComptrollerContractAddress: string;
  isLoading: boolean;
  testId: string;
}

export const Card: React.FC<CardProps> = ({
  type,
  data,
  isLoading,
  asset,
  poolComptrollerContractAddress,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const isApyChartsFeatureEnabled = useIsFeatureEnabled({ name: 'apyCharts' });
  const isNewMarketPageEnabled = useIsFeatureEnabled({ name: 'newMarketPage' });
  const shouldDisplayLiquidationInfo = isNewMarketPageEnabled && type === 'borrow';

  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(0);
  const periodOptions = useMemo(
    () => [
      {
        label: t('market.periodOption.thirtyDays'),
        value: ENTRIES_PER_30_DAYS,
      },
      {
        label: t('market.periodOption.sixMonths'),
        value: ENTRIES_PER_6_MONTHS,
      },
      {
        label: t('market.periodOption.oneYear'),
        value: ENTRIES_PER_YEAR,
      },
    ],
    [t],
  );

  // Splice data based on selected period
  const formattedData = useMemo(
    () =>
      // Data is expected to be received in chronological order, from the oldest entry to the newest
      data.slice(data.length - periodOptions[selectedPeriodIndex].value),
    [data, selectedPeriodIndex, periodOptions],
  );

  const { data: getPoolLiquidationIncentiveData } = useGetPoolLiquidationIncentive(
    {
      poolComptrollerContractAddress,
    },
    {
      enabled: shouldDisplayLiquidationInfo,
    },
  );

  const liquidationIncentivePercentage =
    getPoolLiquidationIncentiveData?.liquidationIncentivePercentage;

  const liquidationThresholdPercentage = useGetLiquidationThresholdPercentage(
    {
      asset,
      poolComptrollerContractAddress,
    },
    {
      enabled: shouldDisplayLiquidationInfo,
    },
  );

  const stats: MarketCardProps['stats'] = useMemo(() => {
    if (!asset) {
      return [];
    }

    const distributionApys = getCombinedDistributionApys({ asset });

    const tmpStats: MarketCardProps['stats'] = [
      {
        label: type === 'supply' ? t('market.stats.totalSupply') : t('market.stats.totalBorrow'),
        value: formatCentsToReadableValue({
          value: type === 'supply' ? asset.supplyBalanceCents : asset.borrowBalanceCents,
        }),
      },
      {
        label: t('market.stats.apy'),
        value: formatPercentageToReadableValue(
          type === 'supply' ? asset.supplyApyPercentage : asset.borrowApyPercentage,
        ),
      },
      {
        label: t('market.stats.distributionApy'),
        value: formatPercentageToReadableValue(distributionApys.supplyApyRewardsPercentage),
      },
    ];

    if (shouldDisplayLiquidationInfo) {
      tmpStats.push(
        {
          label: t('market.stats.liquidationThreshold'),
          value: formatPercentageToReadableValue(liquidationThresholdPercentage),
        },
        {
          label: t('market.stats.liquidationPenalty'),
          value: formatPercentageToReadableValue(liquidationIncentivePercentage),
        },
      );
    }

    return tmpStats;
  }, [
    asset,
    t,
    type,
    liquidationIncentivePercentage,
    liquidationThresholdPercentage,
    shouldDisplayLiquidationInfo,
  ]);

  const legends: MarketCardProps['legends'] = [
    type === 'supply'
      ? {
          label: t('market.legends.supplyApy'),
          color: 'green',
        }
      : {
          label: t('market.legends.borrowApy'),
          color: 'red',
        },
  ];

  return (
    <MarketCard
      title={type === 'supply' ? t('market.supplyInfo.title') : t('market.borrowInfo.title')}
      stats={stats}
      legends={isApyChartsFeatureEnabled ? legends : undefined}
      rightLabel={
        <ButtonGroup
          buttonLabels={periodOptions.map(p => p.label)}
          activeButtonIndex={selectedPeriodIndex}
          onButtonClick={index => setSelectedPeriodIndex(index)}
        />
      }
      {...otherProps}
    >
      {isLoading && data.length === 0 && <Spinner />}

      {data.length > 0 && <ApyChart data={formattedData} type={type} />}
    </MarketCard>
  );
};
