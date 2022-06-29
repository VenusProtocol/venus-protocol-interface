/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import { RouteComponentProps, Redirect } from 'react-router-dom';

import PLACEHOLDER_KEY from 'constants/placeholderKey';
import {
  getToken,
  getVBepToken,
  formatCentsToReadableValue,
  formatToReadablePercentage,
  formatTokensToReadableValue,
} from 'utilities';
import TEST_IDS from 'constants/testIds';
import { VTokenId } from 'types';
import { useTranslation } from 'translation';
import { ApyChart, IApyChartProps, InterestRateChart, IInterestRateChartProps } from 'components';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import Path from 'constants/path';
import { useGetVTokenApySimulations } from 'clients/api';
import MarketInfo, { IMarketInfoProps } from './MarketInfo';
import useGetChartData from './useGetChartData';
import useGetMarketData from './useGetMarketData';
import Card, { ICardProps } from './Card';
import { useStyles } from './styles';

export interface IMarketDetailsUiProps {
  vTokenId: VTokenId;
  supplyChartData: IApyChartProps['data'];
  borrowChartData: IApyChartProps['data'];
  interestRateChartData: IInterestRateChartProps['data'];
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
  dailyInterestsCents?: number;
  reserveFactor?: number;
  collateralFactor?: number;
  mintedTokens?: BigNumber;
  reserveTokens?: BigNumber;
  exchangeRateVTokens?: BigNumber;
  currentUtilizationRate?: number;
}

export const MarketDetailsUi: React.FC<IMarketDetailsUiProps> = ({
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
  dailyInterestsCents,
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

  const supplyInfoStats: ICardProps['stats'] = React.useMemo(
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

  const supplyInfoLegends: ICardProps['legends'] = [
    {
      label: t('marketDetails.legends.supplyApy'),
      color: styles.legendColors.supplyApy,
    },
  ];

  const borrowInfoStats: ICardProps['stats'] = React.useMemo(
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

  const borrowInfoLegends: ICardProps['legends'] = [
    {
      label: t('marketDetails.legends.borrowApy'),
      color: styles.legendColors.borrowApy,
    },
  ];

  const interestRateModelLegends: ICardProps['legends'] = [
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

  const marketInfoStats: IMarketInfoProps['stats'] = React.useMemo(
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
              tokenId: vTokenId,
            }),
      },
      {
        label: t('marketDetails.marketInfo.stats.dailyInterestsLabel'),
        value: formatCentsToReadableValue({
          value: dailyInterestsCents,
        }),
      },
      {
        label: t('marketDetails.marketInfo.stats.reserveTokensLabel'),
        value: formatTokensToReadableValue({
          value: reserveTokens,
          minimizeDecimals: true,
          tokenId: vTokenId,
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
          tokenId: vTokenId,
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
      dailyInterestsCents?.toFixed(),
      reserveTokens?.toFixed(),
      vTokenId,
      reserveFactor?.toFixed(),
      collateralFactor?.toFixed(),
      mintedTokens?.toFixed(),
      exchangeRateVTokens?.toFixed(),
    ],
  );

  if (!supplyChartData.length || !borrowChartData.length || !interestRateChartData.length) {
    return <LoadingSpinner />;
  }

  // @TODO: handle fetching errors

  return (
    <div css={styles.container}>
      <div css={[styles.column, styles.graphsColumn]}>
        <Card
          testId={TEST_IDS.marketDetails.supplyInfo}
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
          testId={TEST_IDS.marketDetails.borrowInfo}
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
          testId={TEST_IDS.marketDetails.interestRateModel}
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
        <MarketInfo stats={marketInfoStats} testId={TEST_IDS.marketDetails.marketInfo} />
      </div>
    </div>
  );
};

export type MarketDetailsProps = RouteComponentProps<{ vTokenId: VTokenId }>;

const MarketDetails: React.FC<MarketDetailsProps> = ({
  match: {
    params: { vTokenId },
  },
}) => {
  const vToken = getVBepToken(vTokenId);

  // Redirect to market page if vTokenId passed through route params is invalid
  if (!vToken) {
    return <Redirect to={Path.MARKET} />;
  }

  const { reserveFactorMantissa, ...marketData } = useGetMarketData({
    vTokenId,
    vTokenAddress: vToken.address,
  });

  const chartData = useGetChartData({
    vTokenId,
  });

  const { data: interestRateChartData = [] } = useGetVTokenApySimulations({
    vTokenId,
    reserveFactorMantissa,
  });

  return (
    <MarketDetailsUi
      vTokenId={vTokenId}
      {...marketData}
      {...chartData}
      interestRateChartData={interestRateChartData}
    />
  );
};

export default MarketDetails;
