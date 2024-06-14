import { useMemo } from 'react';

import { Spinner } from 'components';
import { ApyChart, type ApyChartProps } from 'components/charts/ApyChart';
import { useTranslation } from 'libs/translations';
import type { Asset } from 'types';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  getCombinedDistributionApys,
} from 'utilities';

import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { MarketCard, type MarketCardProps } from '../../MarketCard';
import { useGetPoolLiquidationIncentive } from 'clients/api';
import { useGetLiquidationThresholdPercentage } from './useGetLiquidationThresholdPercentage';

interface CardProps {
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
      title={t('market.supplyInfo.title')}
      stats={stats}
      legends={isApyChartsFeatureEnabled ? legends : undefined}
      rightLabel={<div>Test</div>} // TODO: add period select
      {...otherProps}
    >
      {isLoading && data.length === 0 && <Spinner />}

      {data.length > 0 && <ApyChart data={data} type={type} />}
    </MarketCard>
  );
};
