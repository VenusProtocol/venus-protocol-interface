/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  ApyChart,
  ApyChartProps,
  InterestRateChart,
  InterestRateChartProps,
  Spinner,
} from 'components';
import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'translation';
import { TokenId, VTokenId } from 'types';
import {
  formatCentsToReadableValue,
  formatToReadablePercentage,
  formatTokensToReadableValue,
  getToken,
  getVBepToken,
} from 'utilities';

import { useGetVTokenApySimulations } from 'clients/api';
import Path from 'constants/path';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { TOKENS } from 'constants/tokens';

import Card, { CardProps } from './Card';
import MarketInfo, { MarketInfoProps } from './MarketInfo';
import { useStyles } from './styles';
import TEST_IDS from './testIds';
import useGetChartData from './useGetChartData';
import useGetMarketData from './useGetMarketData';

export interface AssetUiProps {
  vTokenId: VTokenId;
  supplyChartData: ApyChartProps['data'];
  borrowChartData: ApyChartProps['data'];
  interestRateChartData: InterestRateChartProps['data'];
  totalBorrowBalanceCents?: number;
  totalSupplyBalanceCents?: number;
  borrowApyPercentage?: BigNumber;
  supplyApyPercentage?: BigNumber;
  borrowDistributionApyPercentage?: number;
  supplyDistributionApyPercentage?: number;
  tokenPriceDollars?: BigNumber;
  liquidityCents?: BigNumber;
  supplierCount?: number;
  borrowerCount?: number;
  borrowCapTokens?: BigNumber;
  dailyDistributionXvs?: BigNumber;
  dailySupplyingInterestsCents?: number;
  dailyBorrowingInterestsCents?: number;
  reserveFactor?: number;
  collateralFactor?: number;
  mintedTokens?: BigNumber;
  reserveTokens?: BigNumber;
  exchangeRateVTokens?: BigNumber;
  currentUtilizationRate?: number;
}

export const AssetUi: React.FC<AssetUiProps> = ({
  vTokenId,
  totalBorrowBalanceCents,
  borrowApyPercentage,
  borrowDistributionApyPercentage,
  totalSupplyBalanceCents,
  supplyApyPercentage,
  supplyDistributionApyPercentage,
  currentUtilizationRate,
  tokenPriceDollars,
  liquidityCents,
  supplierCount,
  borrowerCount,
  borrowCapTokens,
  dailyDistributionXvs,
  dailySupplyingInterestsCents,
  dailyBorrowingInterestsCents,
  reserveTokens,
  reserveFactor,
  collateralFactor,
  mintedTokens,
  exchangeRateVTokens,
  supplyChartData,
  borrowChartData,
  interestRateChartData,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const token = getToken(vTokenId);
  const vToken = getVBepToken(vTokenId);

  const supplyInfoStats: CardProps['stats'] = React.useMemo(
    () => [
      {
        label: t('asset.supplyInfo.stats.totalSupply'),
        value: formatCentsToReadableValue({
          value: totalSupplyBalanceCents,
          shortenLargeValue: true,
        }),
      },
      {
        label: t('asset.supplyInfo.stats.apy'),
        value: formatToReadablePercentage(supplyApyPercentage),
      },
      {
        label: t('asset.supplyInfo.stats.distributionApy'),
        value: formatToReadablePercentage(supplyDistributionApyPercentage),
      },
    ],
    [totalSupplyBalanceCents?.toFixed(), supplyApyPercentage, supplyDistributionApyPercentage],
  );

  const supplyInfoLegends: CardProps['legends'] = [
    {
      label: t('asset.legends.supplyApy'),
      color: styles.legendColors.supplyApy,
    },
  ];

  const borrowInfoStats: CardProps['stats'] = React.useMemo(
    () => [
      {
        label: t('asset.borrowInfo.stats.totalBorrow'),
        value: formatCentsToReadableValue({
          value: totalBorrowBalanceCents,
          shortenLargeValue: true,
        }),
      },
      {
        label: t('asset.borrowInfo.stats.apy'),
        value: formatToReadablePercentage(borrowApyPercentage),
      },
      {
        label: t('asset.borrowInfo.stats.distributionApy'),
        value: formatToReadablePercentage(borrowDistributionApyPercentage),
      },
    ],
    [totalBorrowBalanceCents?.toFixed(), borrowApyPercentage, borrowDistributionApyPercentage],
  );

  const borrowInfoLegends: CardProps['legends'] = [
    {
      label: t('asset.legends.borrowApy'),
      color: styles.legendColors.borrowApy,
    },
  ];

  const interestRateModelLegends: CardProps['legends'] = [
    {
      label: t('asset.legends.utilizationRate'),
      color: styles.legendColors.utilizationRate,
    },
    {
      label: t('asset.legends.borrowApy'),
      color: styles.legendColors.borrowApy,
    },
    {
      label: t('asset.legends.supplyApy'),
      color: styles.legendColors.supplyApy,
    },
  ];

  const marketInfoStats: MarketInfoProps['stats'] = React.useMemo(
    () => [
      {
        label: t('asset.marketInfo.stats.priceLabel'),
        value:
          tokenPriceDollars === undefined ? PLACEHOLDER_KEY : `$${tokenPriceDollars.toFormat(2)}`,
      },
      {
        label: t('asset.marketInfo.stats.marketLiquidityLabel'),
        value: formatCentsToReadableValue({
          value: liquidityCents,
        }),
      },
      {
        label: t('asset.marketInfo.stats.supplierCountLabel'),
        value: supplierCount ?? '-',
      },
      {
        label: t('asset.marketInfo.stats.borrowerCountLabel'),
        value: borrowerCount ?? '-',
      },
      {
        label: t('asset.marketInfo.stats.borrowCapLabel'),
        value: borrowCapTokens?.isEqualTo(0)
          ? t('asset.marketInfo.stats.unlimitedBorrowCap')
          : formatTokensToReadableValue({
              value: borrowCapTokens,
              minimizeDecimals: true,
              tokenId: vTokenId,
            }),
      },
      {
        label: t('asset.marketInfo.stats.dailySupplyingInterestsLabel'),
        value: formatCentsToReadableValue({
          value: dailySupplyingInterestsCents,
        }),
      },
      {
        label: t('asset.marketInfo.stats.dailyBorrowingInterestsLabel'),
        value: formatCentsToReadableValue({
          value: dailyBorrowingInterestsCents,
        }),
      },
      {
        label: t('asset.marketInfo.stats.dailyDistributionXvs'),
        value: formatTokensToReadableValue({
          value: dailyDistributionXvs,
          minimizeDecimals: true,
          addSymbol: false,
          tokenId: TOKENS.xvs.id as TokenId,
        }),
      },
      {
        label: t('asset.marketInfo.stats.reserveTokensLabel'),
        value: formatTokensToReadableValue({
          value: reserveTokens,
          minimizeDecimals: true,
          tokenId: vTokenId,
        }),
      },
      {
        label: t('asset.marketInfo.stats.reserveFactorLabel'),
        value: formatToReadablePercentage(reserveFactor),
      },
      {
        label: t('asset.marketInfo.stats.collateralFactorLabel'),
        value: formatToReadablePercentage(collateralFactor),
      },
      {
        label: t('asset.marketInfo.stats.mintedTokensLabel', {
          vTokenSymbol: vToken.symbol,
        }),
        value: formatTokensToReadableValue({
          value: mintedTokens,
          minimizeDecimals: true,
          addSymbol: false,
          tokenId: vTokenId,
        }),
      },
      {
        label: t('asset.marketInfo.stats.exchangeRateLabel'),
        value: exchangeRateVTokens
          ? t('asset.marketInfo.stats.exchangeRateValue', {
              tokenSymbol: token.symbol,
              vTokenSymbol: vToken.symbol,
              rate: exchangeRateVTokens.dp(6).toFixed(),
            })
          : PLACEHOLDER_KEY,
      },
    ],
    [
      tokenPriceDollars,
      liquidityCents?.toFixed(),
      supplierCount,
      borrowerCount,
      borrowCapTokens?.toFixed(),
      dailySupplyingInterestsCents,
      dailyBorrowingInterestsCents,
      dailyDistributionXvs?.toFixed(),
      reserveTokens?.toFixed(),
      vTokenId,
      reserveFactor?.toFixed(),
      collateralFactor?.toFixed(),
      mintedTokens?.toFixed(),
      exchangeRateVTokens?.toFixed(),
    ],
  );

  if (!supplyChartData.length || !borrowChartData.length || !interestRateChartData.length) {
    return <Spinner />;
  }

  // @TODO: handle fetching errors

  return (
    <div css={styles.container}>
      <div css={[styles.column, styles.graphsColumn]}>
        <Card
          testId={TEST_IDS.supplyInfo}
          title={t('asset.supplyInfo.title')}
          css={styles.graphCard}
          stats={supplyInfoStats}
          legends={supplyInfoLegends}
        >
          <div css={styles.apyChart}>
            <ApyChart data={supplyChartData} type="supply" />
          </div>
        </Card>

        <Card
          testId={TEST_IDS.borrowInfo}
          title={t('asset.borrowInfo.title')}
          css={styles.graphCard}
          stats={borrowInfoStats}
          legends={borrowInfoLegends}
        >
          <div css={styles.apyChart}>
            <ApyChart data={borrowChartData} type="borrow" />
          </div>
        </Card>

        <Card
          testId={TEST_IDS.interestRateModel}
          title={t('asset.interestRateModel.title')}
          css={styles.graphCard}
          legends={interestRateModelLegends}
        >
          <div css={styles.apyChart}>
            <InterestRateChart
              data={interestRateChartData}
              currentUtilizationRate={currentUtilizationRate}
            />
          </div>
        </Card>
      </div>

      <div css={[styles.column, styles.statsColumn]}>
        <MarketInfo stats={marketInfoStats} testId={TEST_IDS.marketInfo} />
      </div>
    </div>
  );
};

export type AssetProps = RouteComponentProps<{ vTokenId: VTokenId }>;

const Asset: React.FC<AssetProps> = ({
  match: {
    params: { vTokenId },
  },
}) => {
  const vToken = getVBepToken(vTokenId);

  // Redirect to market page if vTokenId passed through route params is invalid
  if (!vToken) {
    return <Redirect to={Path.MARKETS} />;
  }

  const { reserveFactorMantissa, ...marketData } = useGetMarketData({
    vTokenId,
  });

  const chartData = useGetChartData({
    vTokenId,
  });

  const {
    data: interestRateChartData = {
      apySimulations: [],
    },
  } = useGetVTokenApySimulations({
    vTokenId,
    reserveFactorMantissa,
  });

  return (
    <AssetUi
      vTokenId={vTokenId}
      {...marketData}
      {...chartData}
      interestRateChartData={interestRateChartData.apySimulations}
    />
  );
};

export default Asset;
