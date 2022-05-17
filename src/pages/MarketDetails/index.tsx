/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import { RouteComponentProps } from 'react-router-dom';

import { getToken, getVBepToken } from 'utilities';
import { VTokenId } from 'types';
import { useTranslation } from 'translation';
import {
  formatCentsToReadableValue,
  formatToReadablePercentage,
  formatCoinsToReadableValue,
  formatPercentage,
} from 'utilities/common';
import { useGetMarketHistory, useGetMarkets } from 'clients/api';
import { ApyChart, IApyChartProps, InterestRateChart, IInterestRateChartProps } from 'components';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { fakeInterestRateChartData } from './__mocks__/models';
import MarketInfo, { IMarketInfoProps } from './MarketInfo';
import Card, { ICardProps } from './Card';
import { useStyles } from './styles';

export interface IMarketDetailsUiProps {
  vTokenId: VTokenId;
  currentUtilizationRate: number;
  tokenPriceCents: number;
  marketLiquidityTokens: BigNumber;
  supplierCount: number;
  borrowerCount: number;
  borrowCapCents: number;
  dailyInterestsCents: number;
  reserveTokens: BigNumber;
  reserveFactor: number;
  collateralFactor: number;
  mintedTokens: BigNumber;
  exchangeRateVToken: BigNumber;
  supplyChartData: IApyChartProps['data'];
  borrowChartData: IApyChartProps['data'];
  interestRateChartData: IInterestRateChartProps['data'];
  totalBorrowBalanceCents?: number;
  totalSupplyBalanceCents?: number;
  borrowApyPercentage?: number;
  supplyApyPercentage?: number;
  borrowDistributionApyPercentage?: number;
  supplyDistributionApyPercentage?: number;
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
  tokenPriceCents,
  marketLiquidityTokens,
  supplierCount,
  borrowerCount,
  borrowCapCents,
  dailyInterestsCents,
  reserveTokens,
  reserveFactor,
  collateralFactor,
  mintedTokens,
  exchangeRateVToken,
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
      value: formatCentsToReadableValue({
        value: tokenPriceCents,
      }),
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
      value: supplierCount,
    },
    {
      label: t('marketDetails.marketInfo.stats.borrowerCountLabel'),
      value: borrowerCount,
    },
    {
      label: t('marketDetails.marketInfo.stats.borrowCapLabel'),
      value: formatCentsToReadableValue({
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
      value: mintedTokens.toFixed(),
    },
    {
      label: t('marketDetails.marketInfo.stats.exchangeRateLabel'),
      value: t('marketDetails.marketInfo.stats.exchangeRateValue', {
        tokenSymbol: token.symbol,
        vTokenSymbol: vToken.symbol,
        rate: exchangeRateVToken.toFixed(),
      }),
    },
  ];

  if (!supplyChartData.length || !borrowChartData.length) {
    return <LoadingSpinner />;
  }

  return (
    <div css={styles.container}>
      <div css={[styles.column, styles.graphsColumn]}>
        <Card
          data-testid="market-details-supply-info"
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
          data-testid="market-details-borrow-info"
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
          data-testid="market-details-interest-rate-model"
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
        <MarketInfo stats={marketInfoStats} data-testid="market-details-market-info" />
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
  const { data: marketSnapshots = [] } = useGetMarketHistory(
    {
      vTokenId,
    },
    {
      placeholderData: [],
    },
  );

  const { data: markets = [] } = useGetMarkets({ placeholderData: [] });
  const vToken = getVBepToken(vTokenId);
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

  const totalBorrowBalanceCents = assetMarket?.totalBorrowsUsd
    ? +assetMarket.totalBorrowsUsd * 100
    : undefined;
  const totalSupplyBalanceCents = assetMarket?.totalSupplyUsd
    ? +assetMarket.totalSupplyUsd * 100
    : undefined;

  const borrowApyPercentage = assetMarket?.borrowApy;
  const supplyApyPercentage = assetMarket?.supplyApy ? +assetMarket.supplyApy : undefined;

  const borrowDistributionApyPercentage = assetMarket?.borrowVenusApy
    ? +assetMarket.borrowVenusApy
    : undefined;
  const supplyDistributionApyPercentage = assetMarket?.supplyVenusApy
    ? +assetMarket.supplyVenusApy
    : undefined;

  const currentUtilizationRate = 46;
  const tokenPriceCents = 11415;
  const marketLiquidityTokens = new BigNumber(100000000);
  const supplierCount = 1234;
  const borrowerCount = 76;
  const borrowCapCents = 812963286;
  const dailyInterestsCents = 123212;
  const reserveTokens = new BigNumber(100000);
  const reserveFactor = 20;
  const collateralFactor = 70;
  const mintedTokens = new BigNumber(10000000);
  const exchangeRateVToken = new BigNumber(1.345);

  return (
    <MarketDetailsUi
      vTokenId={vTokenId}
      totalBorrowBalanceCents={totalBorrowBalanceCents}
      borrowApyPercentage={borrowApyPercentage}
      borrowDistributionApyPercentage={borrowDistributionApyPercentage}
      totalSupplyBalanceCents={totalSupplyBalanceCents}
      supplyApyPercentage={supplyApyPercentage}
      supplyDistributionApyPercentage={supplyDistributionApyPercentage}
      currentUtilizationRate={currentUtilizationRate}
      tokenPriceCents={tokenPriceCents}
      marketLiquidityTokens={marketLiquidityTokens}
      supplierCount={supplierCount}
      borrowerCount={borrowerCount}
      borrowCapCents={borrowCapCents}
      dailyInterestsCents={dailyInterestsCents}
      reserveTokens={reserveTokens}
      reserveFactor={reserveFactor}
      collateralFactor={collateralFactor}
      mintedTokens={mintedTokens}
      exchangeRateVToken={exchangeRateVToken}
      supplyChartData={supplyChartData}
      borrowChartData={borrowChartData}
      interestRateChartData={fakeInterestRateChartData}
    />
  );
};

export default MarketDetails;
