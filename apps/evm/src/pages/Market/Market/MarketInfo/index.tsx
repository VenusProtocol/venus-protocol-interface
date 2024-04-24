import BigNumber from 'bignumber.js';
import { LabeledInlineContent } from 'components';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import { useMemo } from 'react';
import type { Asset, Token } from 'types';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';
import type { Stat } from '../../types';
import { MarketCard } from '../MarketCard';

export interface MarketInfoProps {
  asset: Asset;
  testId?: string;
}

const MarketInfo: React.FC<MarketInfoProps> = ({ asset, testId }) => {
  const { t } = useTranslation();
  const { blocksPerDay } = useGetChainMetadata();

  const isMarketParticipantCountFeatureEnabled = useIsFeatureEnabled({
    name: 'marketParticipantCounts',
  });

  const { dailySupplyInterestsCents, dailyBorrowInterestsCents } = useMemo(
    () => ({
      // Calculate daily interests for suppliers and borrowers. Note that we don't
      // use BigNumber to calculate these values, as this would slow down
      // calculation a lot while the end result doesn't need to be extremely
      // precise

      dailySupplyInterestsCents:
        asset &&
        +asset.supplyBalanceCents *
          ((1 + asset.supplyPercentageRatePerBlock.toNumber()) ** blocksPerDay - 1),
      dailyBorrowInterestsCents:
        asset &&
        +asset.borrowBalanceCents *
          ((1 + asset.borrowPercentageRatePerBlock.toNumber()) ** blocksPerDay - 1),
    }),
    [asset, blocksPerDay],
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
      // per day
      if (!('dailyDistributedTokens' in distribution)) {
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
        label: t('market.marketInfo.stats.supplyCapLabel'),
        value: !asset.supplyCapTokens
          ? t('market.marketInfo.stats.unlimitedSupplyCap')
          : formatTokensToReadableValue({
              value: asset.supplyCapTokens,
              token: asset.vToken.underlyingToken,
            }),
      },
      {
        label: t('market.marketInfo.stats.borrowCapLabel'),
        value: !asset.borrowCapTokens
          ? t('market.marketInfo.stats.unlimitedBorrowCap')
          : formatTokensToReadableValue({
              value: asset.borrowCapTokens,
              token: asset.vToken.underlyingToken,
            }),
      },
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
    <MarketCard title={t('asset.marketInfo.title')} testId={testId}>
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
