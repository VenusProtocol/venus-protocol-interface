import { useMemo } from 'react';

import { Spinner } from 'components';
import { ApyChart } from 'components/charts/ApyChart';
import { useTranslation } from 'libs/translations';
import type { Asset } from 'types';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  getCombinedDistributionApys,
} from 'utilities';

import { useGetPoolLiquidationIncentive } from 'clients/api';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import TEST_IDS from '../../testIds';
import { MarketCard, type MarketCardProps } from '../MarketCard';
import useGetChartData from './useGetChartData';
import { useGetLiquidationThresholdPercentage } from './useGetLiquidationThresholdPercentage';

interface MarketHistoryProps {
  asset: Asset;
  poolComptrollerContractAddress: string;
}

export const MarketHistory: React.FC<MarketHistoryProps> = ({
  asset,
  poolComptrollerContractAddress,
}) => {
  const { t } = useTranslation();
  const isNewMarketPageEnabled = useIsFeatureEnabled({ name: 'newMarketPage' });

  const { data: chartData, isLoading: isChartDataLoading } = useGetChartData({
    vToken: asset.vToken,
  });

  const { data: getPoolLiquidationIncentiveData } = useGetPoolLiquidationIncentive(
    {
      poolComptrollerContractAddress,
    },
    {
      enabled: isNewMarketPageEnabled,
    },
  );

  const liquidationIncentivePercentage =
    getPoolLiquidationIncentiveData?.liquidationIncentivePercentage;

  const liquidationThresholdPercentage = useGetLiquidationThresholdPercentage({
    asset,
    poolComptrollerContractAddress,
  });

  const distributionApys = useMemo(() => asset && getCombinedDistributionApys({ asset }), [asset]);

  const supplyInfoStats: MarketCardProps['stats'] = useMemo(() => {
    if (!asset) {
      return [];
    }

    const stats: MarketCardProps['stats'] = [
      {
        label: t('market.supplyInfo.stats.totalSupply'),
        value: formatCentsToReadableValue({
          value: asset.supplyBalanceCents,
        }),
      },
      {
        label: t('market.supplyInfo.stats.apy'),
        value: formatPercentageToReadableValue(asset.supplyApyPercentage),
      },
    ];

    if (distributionApys) {
      stats.push({
        label: t('market.supplyInfo.stats.distributionApy'),
        value: formatPercentageToReadableValue(distributionApys.supplyApyRewardsPercentage),
      });
    }

    return stats;
  }, [asset, distributionApys, t]);

  const supplyInfoLegends: MarketCardProps['legends'] = [
    {
      label: t('market.legends.supplyApy'),
      color: 'green',
    },
  ];

  const borrowInfoStats: MarketCardProps['stats'] = useMemo(() => {
    if (!asset) {
      return [];
    }

    const stats: MarketCardProps['stats'] = [
      {
        label: t('market.borrowInfo.stats.totalBorrow'),
        value: formatCentsToReadableValue({
          value: asset.borrowBalanceCents,
        }),
      },
      {
        label: t('market.borrowInfo.stats.apy'),
        value: formatPercentageToReadableValue(asset.borrowApyPercentage),
      },
    ];

    if (distributionApys) {
      stats.push({
        label: t('market.supplyInfo.stats.distributionApy'),
        value: formatPercentageToReadableValue(distributionApys.borrowApyRewardsPercentage),
      });
    }

    if (isNewMarketPageEnabled) {
      stats.push(
        {
          label: t('market.borrowInfo.stats.liquidationThreshold'),
          value: formatPercentageToReadableValue(liquidationThresholdPercentage),
        },
        {
          label: t('market.borrowInfo.stats.liquidationPenalty'),
          value: formatPercentageToReadableValue(liquidationIncentivePercentage),
        },
      );
    }

    return stats;
  }, [
    asset,
    t,
    distributionApys,
    liquidationIncentivePercentage,
    liquidationThresholdPercentage,
    isNewMarketPageEnabled,
  ]);

  const borrowInfoLegends: MarketCardProps['legends'] = [
    {
      label: t('market.legends.borrowApy'),
      color: 'red',
    },
  ];

  return (
    <div className="space-y-6">
      <MarketCard
        testId={TEST_IDS.supplyInfo}
        title={t('market.supplyInfo.title')}
        stats={supplyInfoStats}
        legends={supplyInfoLegends}
      >
        {isChartDataLoading && chartData.supplyChartData.length === 0 && <Spinner />}
        {chartData.supplyChartData.length > 0 && (
          <div>
            <ApyChart data={chartData.supplyChartData} type="supply" />
          </div>
        )}
      </MarketCard>

      <MarketCard
        testId={TEST_IDS.borrowInfo}
        title={t('market.borrowInfo.title')}
        stats={borrowInfoStats}
        legends={borrowInfoLegends}
      >
        {isChartDataLoading && chartData.supplyChartData.length === 0 && <Spinner />}
        {chartData.borrowChartData.length > 0 && (
          <div>
            <ApyChart data={chartData.borrowChartData} type="borrow" />
          </div>
        )}
      </MarketCard>
    </div>
  );
};
