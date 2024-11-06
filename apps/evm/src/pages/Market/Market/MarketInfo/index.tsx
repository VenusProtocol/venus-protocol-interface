import BigNumber from 'bignumber.js';
import { LabeledInlineContent } from 'components';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
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
import TEST_IDS from '../../testIds';
import type { Stat } from '../../types';
import { MarketCard } from '../MarketCard';

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

  const stats: Stat[] = useMemo(() => {
    if (!asset) {
      return [];
    }

    const distributionMapping = [
      ...asset.supplyDistributions,
      ...asset.borrowDistributions,
    ].reduce<{
      [tokenSymbol: string]: {
        rewardToken: Token;
        dailyDistributedTokens: BigNumber;
      };
    }>((accDistributionMapping, distribution) => {
      // Filter out distributions that do not indicate the amount of tokens distributed to everyone
      // per day and those that equal 0
      if (
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
        value: formatTokensToReadableValue({
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
            value: asset.supplierCount ?? '-',
          },
          {
            label: t('market.marketInfo.stats.borrowerCountLabel'),
            value: asset.borrowerCount ?? '-',
          },
        ]
      : [];

    return [
      {
        label: t('market.marketInfo.stats.priceLabel'),
        value: asset.tokenPriceCents
          ? formatCentsToReadableValue({
              value: asset.tokenPriceCents,
              isTokenPrice: true,
            })
          : PLACEHOLDER_KEY,
      },
      {
        label: t('market.marketInfo.stats.marketLiquidityLabel'),
        value: formatCentsToReadableValue({
          value: asset.liquidityCents,
        }),
      },
      ...participantCountRows,
      {
        label: t('market.marketInfo.stats.dailySupplyingInterestsLabel'),
        value: formatCentsToReadableValue({
          value: dailySupplyInterestsCents,
        }),
      },
      {
        label: t('market.marketInfo.stats.dailyBorrowingInterestsLabel'),
        value: formatCentsToReadableValue({
          value: dailyBorrowInterestsCents,
        }),
      },
      ...distributionRows,
      {
        label: t('market.marketInfo.stats.reserveTokensLabel'),
        value: formatTokensToReadableValue({
          value: asset.reserveTokens,
          token: asset.vToken.underlyingToken,
        }),
      },
      {
        label: t('market.marketInfo.stats.reserveFactorLabel'),
        value: formatPercentageToReadableValue(asset.reserveFactor && asset.reserveFactor * 100),
      },
      {
        label: t('market.marketInfo.stats.collateralFactorLabel'),
        value: formatPercentageToReadableValue(
          asset.collateralFactor && asset.collateralFactor * 100,
        ),
      },
      {
        label: t('market.marketInfo.stats.mintedTokensLabel', {
          vTokenSymbol: asset.vToken.symbol,
        }),
        value: formatTokensToReadableValue({
          value: asset.supplyBalanceTokens.multipliedBy(asset.exchangeRateVTokens),
          addSymbol: false,
          token: asset.vToken,
        }),
      },
      {
        label: t('market.marketInfo.stats.exchangeRateLabel'),
        value: asset.exchangeRateVTokens
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
    <MarketCard title={t('asset.marketInfo.title')} testId={TEST_IDS.marketInfo}>
      <ul className="m-0 p-0">
        {stats.map(stat => (
          <li
            className="list-none py-3 px-0 border-b border-lightGrey last-of-type:border-b-0"
            key={`market-info-stat-${stat.label}`}
          >
            <LabeledInlineContent label={stat.label}>
              <span className="font-semibold">{stat.value}</span>
            </LabeledInlineContent>
          </li>
        ))}
      </ul>
    </MarketCard>
  );
};

export default MarketInfo;
