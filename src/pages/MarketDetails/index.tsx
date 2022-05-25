/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import { RouteComponentProps, Redirect } from 'react-router-dom';

import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { getToken, getVBepToken } from 'utilities';
import { VTokenId } from 'types';
import { useTranslation } from 'translation';
import {
  formatCentsToReadableValue,
  formatToReadablePercentage,
  formatCoinsToReadableValue,
  formatPercentage,
  convertWeiToCoins,
} from 'utilities/common';
import { VTOKEN_DECIMALS } from 'config';
import { useGetMarketHistory, useGetMarkets } from 'clients/api';
import { ApyChart, IApyChartProps, InterestRateChart, IInterestRateChartProps } from 'components';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import Path from 'constants/path';
import { fakeInterestRateChartData } from './__mocks__/models';
import MarketInfo, { IMarketInfoProps } from './MarketInfo';
import Card, { ICardProps } from './Card';
import { useStyles } from './styles';

export interface IMarketDetailsUiProps {
  vTokenId: VTokenId;
  currentUtilizationRate: number;
  supplyChartData: IApyChartProps['data'];
  borrowChartData: IApyChartProps['data'];
  interestRateChartData: IInterestRateChartProps['data'];
  totalBorrowBalanceCents?: number;
  totalSupplyBalanceCents?: number;
  borrowApyPercentage?: number;
  supplyApyPercentage?: number;
  borrowDistributionApyPercentage?: number;
  supplyDistributionApyPercentage?: number;
  tokenPriceDollars?: number;
  marketLiquidityTokens?: BigNumber;
  supplierCount?: number;
  borrowerCount?: number;
  borrowCapCents?: number;
  dailyInterestsCents?: number;
  reserveFactor?: number;
  collateralFactor?: number;
  mintedTokens?: BigNumber;
  reserveTokens?: BigNumber;
  exchangeRateVTokens?: BigNumber;
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
  marketLiquidityTokens,
  supplierCount,
  borrowerCount,
  borrowCapCents,
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

  const supplyInfoStats: ICardProps['stats'] = [
    {
      label: t('marketDetails.supplyInfo.stats.totalSupply'),
      value: formatCentsToReadableValue({
        value: totalSupplyBalanceCents,
        shorthand: true,
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
  ];

  const supplyInfoLegends: ICardProps['legends'] = [
    {
      label: t('marketDetails.legends.supplyApy'),
      color: styles.legendColors.supplyApy,
    },
  ];

  const borrowInfoStats: ICardProps['stats'] = [
    {
      label: t('marketDetails.borrowInfo.stats.totalBorrow'),
      value: formatCentsToReadableValue({
        value: totalBorrowBalanceCents,
        shorthand: true,
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
  ];

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

  const marketInfoStats: IMarketInfoProps['stats'] = [
    {
      label: t('marketDetails.marketInfo.stats.priceLabel'),
      value: tokenPriceDollars === undefined ? PLACEHOLDER_KEY : `$${tokenPriceDollars}`,
    },
    {
      label: t('marketDetails.marketInfo.stats.marketLiquidityLabel'),
      value: formatCoinsToReadableValue({
        value: marketLiquidityTokens,
        shorthand: true,
        tokenId: vTokenId,
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
      value:
        borrowCapCents === 0
          ? t('marketDetails.marketInfo.stats.unlimitedBorrowCap')
          : formatCentsToReadableValue({
              value: borrowCapCents,
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
      value: formatCoinsToReadableValue({
        value: reserveTokens,
        shorthand: true,
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
      label: t('marketDetails.marketInfo.stats.mintedTokensLabel', { vTokenSymbol: vToken.symbol }),
      value: formatCoinsToReadableValue({
        value: mintedTokens,
        shorthand: true,
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
  ];

  if (!supplyChartData.length || !borrowChartData.length) {
    return <LoadingSpinner />;
  }

  // @TODO: handle fetching errors

  return (
    <div css={styles.container}>
      <div css={[styles.column, styles.graphsColumn]}>
        <Card
          testId="market-details-supply-info"
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
          testId="market-details-borrow-info"
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
          testId="market-details-interest-rate-model"
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
        <MarketInfo stats={marketInfoStats} testId="market-details-market-info" />
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

  const { data: marketSnapshots = [] } = useGetMarketHistory(
    {
      vTokenId,
    },
    {
      placeholderData: [],
    },
  );

  const { data: markets = [] } = useGetMarkets({ placeholderData: [] });
  const assetMarket = markets.find(
    market => market.address.toLowerCase() === vToken.address.toLowerCase(),
  );

  // Format data for graphs
  const [supplyChartData, borrowChartData] = React.useMemo(
    () =>
      [...marketSnapshots]
        // Snapshots are returned from earliest to oldest, so we reverse them to
        // pass them to the graphs in the right order
        .reverse()
        .reduce(
          ([accSupplyChartData, accBorrowChartData], marketSnapshot) => {
            const timestampMs = new Date(marketSnapshot.createdAt).getTime();

            return [
              [
                ...accSupplyChartData,
                {
                  apyPercentage: formatPercentage(marketSnapshot.supplyApy),
                  timestampMs,
                  balanceCents: new BigNumber(marketSnapshot.totalSupply).multipliedBy(
                    marketSnapshot.priceUSD,
                  ),
                },
              ],
              [
                ...accBorrowChartData,
                {
                  apyPercentage: formatPercentage(marketSnapshot.borrowApy),
                  timestampMs,
                  balanceCents: new BigNumber(marketSnapshot.totalBorrow).multipliedBy(
                    marketSnapshot.priceUSD,
                  ),
                },
              ],
            ];
          },
          [[], []] as [IApyChartProps['data'], IApyChartProps['data']],
        ),
    [JSON.stringify(marketSnapshots)],
  );

  const props = React.useMemo(() => {
    const totalBorrowBalanceCents = assetMarket && +assetMarket.totalBorrowsUsd * 100;
    const totalSupplyBalanceCents = assetMarket && +assetMarket.totalSupplyUsd * 100;
    const borrowApyPercentage = assetMarket?.borrowApy;
    const supplyApyPercentage = assetMarket && +assetMarket.supplyApy;
    const borrowDistributionApyPercentage = assetMarket && +assetMarket.borrowVenusApy;
    const supplyDistributionApyPercentage = assetMarket && +assetMarket.supplyVenusApy;
    const tokenPriceDollars = assetMarket && +assetMarket.tokenPrice;
    const marketLiquidityTokens = assetMarket && new BigNumber(assetMarket.liquidity);
    const supplierCount = assetMarket?.supplierCount;
    const borrowerCount = assetMarket?.borrowerCount;
    const borrowCapCents = assetMarket && +assetMarket.borrowCaps * +assetMarket.tokenPrice * 100;
    const mintedTokens = assetMarket && new BigNumber(assetMarket.totalSupply2);

    const dailyInterestsCents =
      assetMarket &&
      convertWeiToCoins({
        valueWei: new BigNumber(assetMarket.supplierDailyVenus).plus(
          new BigNumber(assetMarket.borrowerDailyVenus),
        ),
        tokenId: 'xvs',
      })
        // Convert XVS to dollars
        .multipliedBy(assetMarket.tokenPrice)
        // Convert to cents
        .multipliedBy(100)
        .toNumber();

    const reserveFactor =
      assetMarket &&
      convertWeiToCoins({
        valueWei: new BigNumber(assetMarket.reserveFactor),
        tokenId: vTokenId,
      })
        // Convert to percentage
        .multipliedBy(100)
        .toNumber();

    const collateralFactor =
      assetMarket &&
      convertWeiToCoins({
        valueWei: new BigNumber(assetMarket.collateralFactor),
        tokenId: vTokenId,
      })
        // Convert to percentage
        .multipliedBy(100)
        .toNumber();

    const reserveTokens =
      assetMarket &&
      convertWeiToCoins({
        valueWei: new BigNumber(assetMarket.totalReserves),
        tokenId: vTokenId,
      });

    const exchangeRateVTokens =
      assetMarket &&
      new BigNumber(1).div(
        new BigNumber(assetMarket.exchangeRate).div(
          new BigNumber(10).pow(18 + getToken(vTokenId).decimals - VTOKEN_DECIMALS),
        ),
      );

    // TODO: calculate actual value (see https://app.clickup.com/t/29xmavh)
    const currentUtilizationRate = 46;

    return {
      totalBorrowBalanceCents,
      totalSupplyBalanceCents,
      borrowApyPercentage,
      supplyApyPercentage,
      borrowDistributionApyPercentage,
      supplyDistributionApyPercentage,
      tokenPriceDollars,
      marketLiquidityTokens,
      supplierCount,
      borrowerCount,
      borrowCapCents,
      mintedTokens,
      dailyInterestsCents,
      reserveFactor,
      collateralFactor,
      reserveTokens,
      exchangeRateVTokens,
      currentUtilizationRate,
    };
  }, [JSON.stringify(assetMarket)]);

  return (
    <MarketDetailsUi
      vTokenId={vTokenId}
      supplyChartData={supplyChartData}
      borrowChartData={borrowChartData}
      // TODO: pass actual data (see https://app.clickup.com/t/29xmavh)
      interestRateChartData={fakeInterestRateChartData}
      {...props}
    />
  );
};

export default MarketDetails;
