/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { getToken, getVBepToken } from 'utilities';
import { TokenId, VTokenId } from 'types';
import { useTranslation } from 'translation';
import {
  formatCentsToReadableValue,
  formatToReadablePercentage,
  formatCoinsToReadableValue,
} from 'utilities/common';
import { ApyChart, IApyChartProps, InterestRateChart, IInterestRateChartProps } from 'components';
import { fakeApyChartData, fakeInterestRateChartData } from './mockData';
import MarketInfo, { IMarketInfoProps } from './MarketInfo';
import Card, { ICardProps } from './Card';
import { useStyles } from './styles';

export interface IMarketDetailsUiProps {
  tokenId: TokenId;
  vTokenId: VTokenId;
  totalBorrowBalanceCents: number;
  borrowApyPercentage: number;
  borrowDistributionApyPercentage: number;
  totalSupplyBalanceCents: number;
  supplyApyPercentage: number;
  supplyDistributionApyPercentage: number;
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
}

export const MarketDetailsUi: React.FC<IMarketDetailsUiProps> = ({
  tokenId,
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

  const token = getToken(tokenId);
  const vToken = getVBepToken(vTokenId);

  const supplyInfoStats: ICardProps['stats'] = [
    {
      label: t('marketDetails.supplyInfo.stats.totalSupply'),
      value: formatCentsToReadableValue({
        value: totalBorrowBalanceCents,
        shorthand: true,
      }),
    },
    {
      label: t('marketDetails.supplyInfo.stats.apy'),
      value: formatToReadablePercentage(borrowApyPercentage),
    },
    {
      label: t('marketDetails.supplyInfo.stats.distributionApy'),
      value: formatToReadablePercentage(borrowDistributionApyPercentage),
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
        value: totalSupplyBalanceCents,
        shorthand: true,
      }),
    },
    {
      label: t('marketDetails.borrowInfo.stats.apy'),
      value: formatToReadablePercentage(supplyApyPercentage),
    },
    {
      label: t('marketDetails.borrowInfo.stats.distributionApy'),
      value: formatToReadablePercentage(supplyDistributionApyPercentage),
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
        tokenId,
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
        tokenId,
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

  return (
    <div css={styles.container}>
      <div css={[styles.column, styles.graphsColumn]}>
        <Card
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
        <MarketInfo stats={marketInfoStats} />
      </div>
    </div>
  );
};

const MarketDetails: React.FC = () => {
  // TODO: fetch actual data (see https://app.clickup.com/t/29xm9d3 and
  // https://app.clickup.com/t/29xm9ct)
  const tokenId = 'bnb';
  const vTokenid = 'bnb';
  const totalBorrowBalanceCents = 100000000;
  const borrowApyPercentage = 2.24;
  const borrowDistributionApyPercentage = 1.1;
  const totalSupplyBalanceCents = 100000000000;
  const supplyApyPercentage = 4.56;
  const supplyDistributionApyPercentage = 0.45;
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
      tokenId={tokenId}
      vTokenId={vTokenid}
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
      supplyChartData={fakeApyChartData}
      borrowChartData={fakeApyChartData}
      interestRateChartData={fakeInterestRateChartData}
    />
  );
};

export default MarketDetails;
