import BigNumber from 'bignumber.js';
import {
  MarketInfo as MarketInfoCard,
  type MarketInfoProps as MarketInfoCardProps,
} from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { DAYS_PER_YEAR } from 'constants/time';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import { useMemo } from 'react';
import type { Asset, Token } from 'types';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';
import TEST_IDS from '../testIds';

export interface MarketInfoProps {
  asset: Asset;
}

const MarketInfo: React.FC<MarketInfoProps> = ({ asset }) => {
  const { t } = useTranslation();

  const isMarketParticipantCountFeatureEnabled = useIsFeatureEnabled({
    name: 'marketParticipantCounts',
  });

  const { dailySupplyInterestsCents, dailyBorrowInterestsCents } = useMemo(
    () => ({
      dailySupplyInterestsCents: asset.supplyBalanceCents
        .multipliedBy(asset.supplyApyPercentage)
        .div(100)
        .div(DAYS_PER_YEAR),
      dailyBorrowInterestsCents: asset.borrowBalanceCents
        .multipliedBy(asset.borrowApyPercentage)
        .div(100)
        .div(DAYS_PER_YEAR),
    }),
    [asset],
  );

  const stats: MarketInfoCardProps['items'] = useMemo(() => {
    if (!asset) {
      return [];
    }

    const distributionMapping = [
      ...asset.supplyTokenDistributions,
      ...asset.borrowTokenDistributions,
    ].reduce<{
      [tokenSymbol: string]: {
        rewardToken: Token;
        dailyDistributedTokens: BigNumber;
      };
    }>((accDistributionMapping, distribution) => {
      // Filter out distributions that do not indicate the amount of tokens distributed to everyone
      // per day and those that equal 0
      if (
        !distribution.isActive ||
        !('dailyDistributedTokens' in distribution) ||
        distribution.dailyDistributedTokens.isEqualTo(0)
      ) {
        return accDistributionMapping;
      }

      const accCopy = { ...accDistributionMapping };

      if (!Object.prototype.hasOwnProperty.call(accCopy, distribution.token.address)) {
        accCopy[distribution.token.address] = {
          rewardToken: distribution.token,
          dailyDistributedTokens: new BigNumber(0),
        };
      }

      accCopy[distribution.token.address] = {
        ...accCopy[distribution.token.address],
        dailyDistributedTokens: accCopy[distribution.token.address].dailyDistributedTokens.plus(
          distribution.dailyDistributedTokens,
        ),
      };

      return accCopy;
    }, {});

    const distributionRows = Object.values(distributionMapping).map(
      ({ rewardToken, dailyDistributedTokens }) => ({
        label: t('market.marketInfo.stats.dailyDistribution', {
          tokenSymbol: rewardToken.symbol,
        }),
        children: formatTokensToReadableValue({
          value: dailyDistributedTokens,
          addSymbol: false,
          token: rewardToken,
        }),
      }),
    );

    const participantCountRows = isMarketParticipantCountFeatureEnabled
      ? [
          {
            label: t('market.marketInfo.stats.supplierCountLabel'),
            children: asset.supplierCount ?? '-',
          },
          {
            label: t('market.marketInfo.stats.borrowerCountLabel'),
            children: asset.borrowerCount ?? '-',
          },
        ]
      : [];

    return [
      ...participantCountRows,
      {
        label: t('market.marketInfo.stats.dailySupplyingInterestsLabel'),
        children: formatCentsToReadableValue({
          value: dailySupplyInterestsCents,
        }),
      },
      {
        label: t('market.marketInfo.stats.dailyBorrowingInterestsLabel'),
        children: formatCentsToReadableValue({
          value: dailyBorrowInterestsCents,
        }),
      },
      ...distributionRows,
      {
        label: t('market.marketInfo.stats.reserveFactorLabel'),
        children: formatPercentageToReadableValue(asset.reserveFactor && asset.reserveFactor * 100),
      },
      {
        label: t('market.marketInfo.stats.isBorrowableLabel'),
        children: asset.isBorrowable
          ? t('market.marketInfo.stats.yes')
          : t('market.marketInfo.stats.no'),
      },
      {
        label: t('market.marketInfo.stats.collateralFactorLabel'),
        children: formatPercentageToReadableValue(asset.collateralFactor * 100),
      },
      {
        label: t('market.marketInfo.stats.liquidationThresholdLabel'),
        children: formatPercentageToReadableValue(asset.liquidationThresholdPercentage),
      },
      {
        label: t('market.marketInfo.stats.liquidationPenaltyLabel'),
        children: formatPercentageToReadableValue(asset.liquidationPenaltyPercentage),
      },
      {
        label: t('market.marketInfo.stats.exchangeRateLabel'),
        children: asset.exchangeRateVTokens
          ? t('market.marketInfo.stats.exchangeRateValue', {
              tokenSymbol: asset.vToken.underlyingToken.symbol,
              vTokenSymbol: asset.vToken.symbol,
              rate: asset.exchangeRateVTokens.dp(6).toFixed(),
            })
          : PLACEHOLDER_KEY,
      },
    ];
  }, [
    asset,
    t,
    dailySupplyInterestsCents,
    dailyBorrowInterestsCents,
    isMarketParticipantCountFeatureEnabled,
  ]);

  return (
    <MarketInfoCard
      title={t('asset.marketInfo.title')}
      data-testid={TEST_IDS.marketInfo}
      items={stats}
    />
  );
};

export default MarketInfo;
