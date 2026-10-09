import BigNumber from 'bignumber.js';
import { useState } from 'react';

import { type LiquidityHubHistoryPeriod, useGetSpokeMarketHistory } from 'clients/api';
import { MarketHistoryCard, type MarketHistoryCardPeriodOption } from 'components';
import { useTranslation } from 'libs/translations';
import type { SpokeAsset } from 'types';

import {
  clampToZero,
  convertMantissaToTokens,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

export interface BorrowInfoProps {
  asset: SpokeAsset;
}

export const BorrowInfo: React.FC<BorrowInfoProps> = ({ asset }) => {
  const { t, Trans } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<LiquidityHubHistoryPeriod>('1m');

  const periodOptions: MarketHistoryCardPeriodOption<LiquidityHubHistoryPeriod>[] = [
    { label: t('spokeMarket.periodOption.oneWeek'), value: '1w' },
    { label: t('spokeMarket.periodOption.oneMonth'), value: '1m' },
    { label: t('spokeMarket.periodOption.threeMonths'), value: '3m' },
    { label: t('spokeMarket.periodOption.oneYear'), value: '1y' },
    { label: t('spokeMarket.periodOption.all'), value: 'all' },
  ];

  const { data: getSpokeMarketHistoryData, isLoading: isGetSpokeMarketHistoryLoading } =
    useGetSpokeMarketHistory({ vTokenAddress: asset.vToken.address, period: selectedPeriod });

  const badDebtTokens = convertMantissaToTokens({
    value: new BigNumber(asset.badDebtMantissa.toString()),
    token: asset.vToken.underlyingToken,
  });

  const availableBorrowTokens = clampToZero({
    value: BigNumber.min(
      asset.borrowCapTokens.minus(asset.borrowBalanceTokens).minus(badDebtTokens),
      asset.cashTokens,
    ),
  });

  const borrowCapThresholdTooltip = (
    <Trans
      i18nKey="spokeMarket.borrowCapThreshold.tooltip"
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
    <MarketHistoryCard
      title={t('spokeMarket.borrowInfo.title')}
      averageApyPercentage={getSpokeMarketHistoryData?.averageBorrowApyPercentage}
      cells={[
        {
          label: t('spokeMarket.borrowInfo.currentApy'),
          value: formatPercentageToReadableValue(asset.borrowApyPercentage),
        },
      ]}
      cap={{
        token: asset.vToken.underlyingToken,
        title: t('spokeMarket.borrowCapThreshold.title'),
        tokenPriceCents: asset.tokenPriceCents,
        limitTokens: asset.supplyBalanceTokens,
        valueTokens: asset.borrowBalanceTokens,
        tooltip: <span className="whitespace-pre-line">{borrowCapThresholdTooltip}</span>,
      }}
      history={{
        type: 'borrow',
        data: getSpokeMarketHistoryData?.marketSnapshots ?? [],
        isLoading: isGetSpokeMarketHistoryLoading,
        selectedPeriod,
        setSelectedPeriod,
        periodOptions,
      }}
    />
  );
};
