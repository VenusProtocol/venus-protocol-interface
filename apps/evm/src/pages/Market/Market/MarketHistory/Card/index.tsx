import { useMemo } from 'react';

import { ButtonGroup, Spinner } from 'components';
import { ApyChart, type ApyChartProps } from 'components/charts/ApyChart';
import { useTranslation } from 'libs/translations';
import type { Asset } from 'types';
import { formatPercentageToReadableValue, getCombinedDistributionApys } from 'utilities';

import { type MarketHistoryPeriodType, useGetPoolLiquidationIncentive } from 'clients/api';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { MarketCard, type MarketCardProps } from '../../MarketCard';
import { CapThreshold } from './CapThreshold';
import { useGetLiquidationThresholdPercentage } from './useGetLiquidationThresholdPercentage';

export interface CardProps {
  type: ApyChartProps['type'];
  asset: Asset;
  data: ApyChartProps['data'];
  poolComptrollerContractAddress: string;
  isLoading: boolean;
  testId: string;
  selectedPeriod: MarketHistoryPeriodType;
  setSelectedPeriod: (period: MarketHistoryPeriodType) => void;
}

export const Card: React.FC<CardProps> = ({
  type,
  data,
  isLoading,
  asset,
  poolComptrollerContractAddress,
  selectedPeriod,
  setSelectedPeriod,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const isApyChartsFeatureEnabled = useIsFeatureEnabled({ name: 'apyCharts' });
  const shouldDisplayLiquidationInfo = type === 'borrow';

  const periodOptions: { label: string; value: MarketHistoryPeriodType }[] = useMemo(
    () => [
      {
        label: t('market.periodOption.thirtyDays'),
        value: 'month',
      },
      {
        label: t('market.periodOption.sixMonths'),
        value: 'halfyear',
      },
      {
        label: t('market.periodOption.oneYear'),
        value: 'year',
      },
    ],
    [t],
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
        label: t('market.stats.apy'),
        value: formatPercentageToReadableValue(
          type === 'supply' ? asset.supplyApyPercentage : asset.borrowApyPercentage,
        ),
      },
      {
        label: t('market.stats.distributionApy'),
        value: formatPercentageToReadableValue(
          type === 'supply'
            ? distributionApys.supplyApyRewardsPercentage
            : distributionApys.borrowApyRewardsPercentage,
        ),
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
      topContent={
        <CapThreshold
          type={type}
          tokenPriceCents={asset.tokenPriceCents}
          capTokens={type === 'supply' ? asset.supplyCapTokens : asset.borrowCapTokens}
          balanceTokens={type === 'supply' ? asset.supplyBalanceTokens : asset.borrowBalanceTokens}
          token={asset.vToken.underlyingToken}
        />
      }
      rightContent={
        isApyChartsFeatureEnabled ? (
          <ButtonGroup
            buttonLabels={periodOptions.map(p => p.label)}
            activeButtonIndex={periodOptions.findIndex(p => p.value === selectedPeriod)}
            onButtonClick={index => setSelectedPeriod(periodOptions[index].value)}
          />
        ) : undefined
      }
      {...otherProps}
    >
      {isLoading && data.length === 0 && <Spinner />}

      {data.length > 0 && <ApyChart data={data} type={type} selectedPeriod={selectedPeriod} />}
    </MarketCard>
  );
};
