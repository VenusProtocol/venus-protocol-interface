import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import type { Address } from 'viem';

import type { MarketHistoryPeriodType } from 'clients/api';
import { Apy, ButtonGroup, Spinner } from 'components';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import { ApyChart, type ApyChartProps } from 'pages/Market/MarketHistory/Card/ApyChart';
import type { Asset } from 'types';
import { formatPercentageToReadableValue } from 'utilities';
import { MarketCard, type MarketCardProps } from '../../MarketCard';
import { CapThreshold } from './CapThreshold';

export interface CardProps extends Omit<MarketCardProps, 'title'> {
  type: ApyChartProps['type'];
  asset: Asset;
  data: ApyChartProps['data'];
  poolComptrollerContractAddress: Address;
  isLoading: boolean;
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

  const stats: MarketCardProps['stats'] = useMemo(() => {
    if (!asset) {
      return [];
    }

    const averageApy =
      data.length > 0
        ? data.reduce((acc, item) => acc + item.apyPercentage, 0) / data.length
        : undefined;

    const tmpStats: MarketCardProps['stats'] = [];

    if (averageApy) {
      tmpStats.push({
        label: t('market.stats.averageApy'),
        value: formatPercentageToReadableValue(averageApy),
      });
    }

    tmpStats.push({
      label: t('market.stats.apy'),
      value: <Apy asset={asset} type={type} />,
    });

    if (shouldDisplayLiquidationInfo) {
      tmpStats.push(
        {
          label: t('market.stats.liquidationThreshold'),
          value: formatPercentageToReadableValue(asset.liquidationThresholdPercentage),
        },
        {
          label: t('market.stats.liquidationPenalty'),
          value: formatPercentageToReadableValue(asset.liquidationPenaltyPercentage),
        },
      );
    }

    return tmpStats;
  }, [asset, data, t, type, shouldDisplayLiquidationInfo]);

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
      legends={isApyChartsFeatureEnabled && data.length > 0 ? legends : undefined}
      topContent={
        <CapThreshold
          type={type}
          tokenPriceCents={asset.tokenPriceCents}
          balanceTokens={type === 'supply' ? asset.supplyBalanceTokens : asset.borrowBalanceTokens}
          capTokens={type === 'supply' ? asset.supplyCapTokens : asset.borrowCapTokens}
          limitTokens={
            type === 'supply'
              ? asset.supplyCapTokens
              : BigNumber.min(asset.supplyBalanceTokens, asset.borrowCapTokens)
          }
          token={asset.vToken.underlyingToken}
        />
      }
      rightContent={
        isApyChartsFeatureEnabled && data.length > 0 ? (
          <ButtonGroup
            buttonSize="xs"
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
