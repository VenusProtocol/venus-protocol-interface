import type { MarketHistoryPeriodType } from 'clients/api';
import { AssetApy, MarketHistoryCard, type MarketHistoryCardPeriodOption } from 'components';
import { useGetMarketChartData } from 'hooks/useGetMarketChartData';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import type { Asset } from 'types';
import {
  clampToZero,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

import TEST_IDS from '../testIds';

interface MarketHistoryProps {
  asset: Asset;
}

export const MarketHistory: React.FC<MarketHistoryProps> = ({ asset }) => {
  const { t, Trans } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<MarketHistoryPeriodType>('month');

  const {
    data: { supplyChartData, borrowChartData },
    isLoading: isChartDataLoading,
  } = useGetMarketChartData({
    vToken: asset.vToken,
    period: selectedPeriod,
  });

  const periodOptions: MarketHistoryCardPeriodOption[] = [
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
  ];

  const availableSupplyTokens = clampToZero({
    value: asset.supplyCapTokens.minus(asset.supplyBalanceTokens),
  });

  const availableBorrowTokens = clampToZero({
    value: asset.borrowCapTokens.minus(asset.borrowBalanceTokens),
  });

  const supplyCapThresholdTooltip = t('market.supplyCapThreshold.tooltip', {
    amountDollars: formatCentsToReadableValue({
      value: availableSupplyTokens.multipliedBy(asset.tokenPriceCents),
    }),
    amountTokens: formatTokensToReadableValue({
      value: availableSupplyTokens,
      token: asset.vToken.underlyingToken,
    }),
  });

  const borrowCapThresholdTooltip = (
    <Trans
      i18nKey="market.borrowCapThreshold.tooltip"
      components={{
        LineBreak: <br />,
      }}
      values={{
        amountDollars: formatCentsToReadableValue({
          value: availableBorrowTokens.multipliedBy(asset.tokenPriceCents),
        }),
        amountTokens: formatTokensToReadableValue({
          value: availableBorrowTokens,
          token: asset.vToken.underlyingToken,
        }),
        capTokens: formatTokensToReadableValue({
          value: asset.borrowCapTokens,
          token: asset.vToken.underlyingToken,
        }),
      }}
    />
  );

  return (
    <div className="space-y-6">
      <MarketHistoryCard
        title={t('market.supplyInfo.title')}
        data-testid={TEST_IDS.supplyInfo}
        cells={[
          {
            label: t('market.stats.apy'),
            value: <AssetApy asset={asset} type="supply" />,
          },
        ]}
        cap={{
          token: asset.vToken.underlyingToken,
          title: t('market.supplyCapThreshold.title'),
          tokenPriceCents: asset.tokenPriceCents,
          limitTokens: asset.supplyCapTokens,
          valueTokens: asset.supplyBalanceTokens,
          tooltip: <span className="whitespace-pre-line">{supplyCapThresholdTooltip}</span>,
        }}
        history={{
          type: 'supply',
          data: supplyChartData ?? [],
          isLoading: isChartDataLoading,
          selectedPeriod,
          setSelectedPeriod,
          periodOptions,
        }}
      />

      <MarketHistoryCard
        title={t('market.borrowInfo.title')}
        data-testid={TEST_IDS.borrowInfo}
        cells={[
          {
            label: t('market.stats.apy'),
            value: <AssetApy asset={asset} type="borrow" />,
          },
          {
            label: t('market.stats.liquidationThreshold'),
            value: formatPercentageToReadableValue(asset.liquidationThresholdPercentage),
          },
          {
            label: t('market.stats.liquidationPenalty'),
            value: formatPercentageToReadableValue(asset.liquidationPenaltyPercentage),
          },
        ]}
        cap={{
          token: asset.vToken.underlyingToken,
          title: t('market.borrowCapThreshold.title'),
          tokenPriceCents: asset.tokenPriceCents,
          limitTokens: asset.borrowCapTokens,
          valueTokens: asset.borrowBalanceTokens,
          tooltip: <span className="whitespace-pre-line">{borrowCapThresholdTooltip}</span>,
        }}
        history={{
          type: 'borrow',
          data: borrowChartData ?? [],
          isLoading: isChartDataLoading,
          selectedPeriod,
          setSelectedPeriod,
          periodOptions,
        }}
      />
    </div>
  );
};
