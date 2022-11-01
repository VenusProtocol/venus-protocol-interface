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
import {
  formatCentsToReadableValue,
  formatToReadablePercentage,
  formatTokensToReadableValue,
  unsafelyGetToken,
  unsafelyGetVToken,
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

export interface MarketDetailsUiProps {
  vTokenId: string;
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

export const MarketDetailsUi: React.FC<MarketDetailsUiProps> = ({
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

  const token = unsafelyGetToken(vTokenId);
  const vToken = unsafelyGetVToken(vTokenId);

  const supplyInfoStats: CardProps['stats'] = React.useMemo(
    () => [
      {
        label: t('marketDetails.supplyInfo.stats.totalSupply'),
        value: formatCentsToReadableValue({
          value: totalSupplyBalanceCents,
          shortenLargeValue: true,
        }),
      },
      {
        label: t('marketDetails.supplyInfo.stats.apy'),
        value: formatToReadablePercentage(supplyApyPercentage),
      },
      {
        label: t('marketDetails.supplyInfo.stats.distributionApy'),
        value: formatToReadablePercentage(supplyDistributionApyPercentage),
      },
    ],
    [totalSupplyBalanceCents?.toFixed(), supplyApyPercentage, supplyDistributionApyPercentage],
  );

  const supplyInfoLegends: CardProps['legends'] = [
    {
      label: t('marketDetails.legends.supplyApy'),
      color: styles.legendColors.supplyApy,
    },
  ];

  const borrowInfoStats: CardProps['stats'] = React.useMemo(
    () => [
      {
        label: t('marketDetails.borrowInfo.stats.totalBorrow'),
        value: formatCentsToReadableValue({
          value: totalBorrowBalanceCents,
          shortenLargeValue: true,
        }),
      },
      {
        label: t('marketDetails.borrowInfo.stats.apy'),
        value: formatToReadablePercentage(borrowApyPercentage),
      },
      {
        label: t('marketDetails.borrowInfo.stats.distributionApy'),
        value: formatToReadablePercentage(borrowDistributionApyPercentage),
      },
    ],
    [totalBorrowBalanceCents?.toFixed(), borrowApyPercentage, borrowDistributionApyPercentage],
  );

  const borrowInfoLegends: CardProps['legends'] = [
    {
      label: t('marketDetails.legends.borrowApy'),
      color: styles.legendColors.borrowApy,
    },
  ];

  const interestRateModelLegends: CardProps['legends'] = [
    {
      label: t('marketDetails.legends.utilizationRate'),
      color: styles.legendColors.utilizationRate,
    },
    {
      label: t('marketDetails.legends.borrowApy'),
      color: styles.legendColors.borrowApy,
    },
    {
      label: t('marketDetails.legends.supplyApy'),
      color: styles.legendColors.supplyApy,
    },
  ];

  const marketInfoStats: MarketInfoProps['stats'] = React.useMemo(
    () => [
      {
        label: t('marketDetails.marketInfo.stats.priceLabel'),
        value:
          tokenPriceDollars === undefined ? PLACEHOLDER_KEY : `$${tokenPriceDollars.toFormat(2)}`,
      },
      {
        label: t('marketDetails.marketInfo.stats.marketLiquidityLabel'),
        value: formatCentsToReadableValue({
          value: liquidityCents,
        }),
      },
      {
        label: t('marketDetails.marketInfo.stats.supplierCountLabel'),
        value: supplierCount ?? '-',
      },
      {
        label: t('marketDetails.marketInfo.stats.borrowerCountLabel'),
        value: borrowerCount ?? '-',
      },
      {
        label: t('marketDetails.marketInfo.stats.borrowCapLabel'),
        value: borrowCapTokens?.isEqualTo(0)
          ? t('marketDetails.marketInfo.stats.unlimitedBorrowCap')
          : formatTokensToReadableValue({
              value: borrowCapTokens,
              minimizeDecimals: true,
              token: vToken,
            }),
      },
      {
        label: t('marketDetails.marketInfo.stats.dailySupplyingInterestsLabel'),
        value: formatCentsToReadableValue({
          value: dailySupplyingInterestsCents,
        }),
      },
      {
        label: t('marketDetails.marketInfo.stats.dailyBorrowingInterestsLabel'),
        value: formatCentsToReadableValue({
          value: dailyBorrowingInterestsCents,
        }),
      },
      {
        label: t('marketDetails.marketInfo.stats.dailyDistributionXvs'),
        value: formatTokensToReadableValue({
          value: dailyDistributionXvs,
          minimizeDecimals: true,
          addSymbol: false,
          token: TOKENS.xvs,
        }),
      },
      {
        label: t('marketDetails.marketInfo.stats.reserveTokensLabel'),
        value: formatTokensToReadableValue({
          value: reserveTokens,
          minimizeDecimals: true,
          token,
        }),
      },
      {
        label: t('marketDetails.marketInfo.stats.reserveFactorLabel'),
        value: formatToReadablePercentage(reserveFactor),
      },
      {
        label: t('marketDetails.marketInfo.stats.collateralFactorLabel'),
        value: formatToReadablePercentage(collateralFactor),
      },
      {
        label: t('marketDetails.marketInfo.stats.mintedTokensLabel', {
          vTokenSymbol: vToken.symbol,
        }),
        value: formatTokensToReadableValue({
          value: mintedTokens,
          minimizeDecimals: true,
          addSymbol: false,
          token: vToken,
        }),
      },
      {
        label: t('marketDetails.marketInfo.stats.exchangeRateLabel'),
        value: exchangeRateVTokens
          ? t('marketDetails.marketInfo.stats.exchangeRateValue', {
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
          title={t('marketDetails.supplyInfo.title')}
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
          title={t('marketDetails.borrowInfo.title')}
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
          title={t('marketDetails.interestRateModel.title')}
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

export type MarketDetailsProps = RouteComponentProps<{ vTokenId: string }>;

const MarketDetails: React.FC<MarketDetailsProps> = ({
  match: {
    params: { vTokenId },
  },
}) => {
  const vToken = unsafelyGetVToken(vTokenId);

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
    <MarketDetailsUi
      vTokenId={vTokenId}
      {...marketData}
      {...chartData}
      interestRateChartData={interestRateChartData.apySimulations}
    />
  );
};

export default MarketDetails;
