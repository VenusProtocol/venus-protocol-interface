/** @jsxImportSource @emotion/react */
import { Paper } from '@mui/material';
import BigNumber from 'bignumber.js';
import {
  ApyChart,
  ApyChartProps,
  Button,
  InterestRateChart,
  InterestRateChartProps,
  SecondaryButton,
  Spinner,
} from 'components';
import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'translation';
import { VToken } from 'types';
import {
  formatCentsToReadableValue,
  formatToReadablePercentage,
  formatTokensToReadableValue,
  getVTokenByAddress,
} from 'utilities';

import { useGetVTokenApySimulations } from 'clients/api';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { routes } from 'constants/routing';
import { TOKENS } from 'constants/tokens';
import { useHideXlDownCss, useShowXlDownCss } from 'hooks/responsive';
import useBorrowRepayModal from 'hooks/useBorrowRepayModal';
import useSupplyWithdrawModal from 'hooks/useSupplyWithdrawModal';

import Card, { CardProps } from './Card';
import MarketInfo, { MarketInfoProps } from './MarketInfo';
import { useStyles } from './styles';
import TEST_IDS from './testIds';
import useGetChartData from './useGetChartData';
import useGetMarketData from './useGetMarketData';

export interface MarketUiProps {
  vToken: VToken;
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

export const MarketUi: React.FC<MarketUiProps> = ({
  vToken,
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

  const hideXlDownCss = useHideXlDownCss();
  const showXlDownCss = useShowXlDownCss();

  const { openBorrowRepayModal, BorrowRepayModal } = useBorrowRepayModal();
  const { openSupplyWithdrawModal, SupplyWithdrawModal } = useSupplyWithdrawModal();

  const supplyInfoStats: CardProps['stats'] = React.useMemo(
    () => [
      {
        label: t('market.supplyInfo.stats.totalSupply'),
        value: formatCentsToReadableValue({
          value: totalSupplyBalanceCents,
          shortenLargeValue: true,
        }),
      },
      {
        label: t('market.supplyInfo.stats.apy'),
        value: formatToReadablePercentage(supplyApyPercentage),
      },
      {
        label: t('market.supplyInfo.stats.distributionApy'),
        value: formatToReadablePercentage(supplyDistributionApyPercentage),
      },
    ],
    [totalSupplyBalanceCents?.toFixed(), supplyApyPercentage, supplyDistributionApyPercentage],
  );

  const supplyInfoLegends: CardProps['legends'] = [
    {
      label: t('market.legends.supplyApy'),
      color: styles.legendColors.supplyApy,
    },
  ];

  const borrowInfoStats: CardProps['stats'] = React.useMemo(
    () => [
      {
        label: t('market.borrowInfo.stats.totalBorrow'),
        value: formatCentsToReadableValue({
          value: totalBorrowBalanceCents,
          shortenLargeValue: true,
        }),
      },
      {
        label: t('market.borrowInfo.stats.apy'),
        value: formatToReadablePercentage(borrowApyPercentage),
      },
      {
        label: t('market.borrowInfo.stats.distributionApy'),
        value: formatToReadablePercentage(borrowDistributionApyPercentage),
      },
    ],
    [totalBorrowBalanceCents?.toFixed(), borrowApyPercentage, borrowDistributionApyPercentage],
  );

  const borrowInfoLegends: CardProps['legends'] = [
    {
      label: t('market.legends.borrowApy'),
      color: styles.legendColors.borrowApy,
    },
  ];

  const interestRateModelLegends: CardProps['legends'] = [
    {
      label: t('market.legends.utilizationRate'),
      color: styles.legendColors.utilizationRate,
    },
    {
      label: t('market.legends.borrowApy'),
      color: styles.legendColors.borrowApy,
    },
    {
      label: t('market.legends.supplyApy'),
      color: styles.legendColors.supplyApy,
    },
  ];

  const marketInfoStats: MarketInfoProps['stats'] = React.useMemo(
    () => [
      {
        label: t('market.marketInfo.stats.priceLabel'),
        value:
          tokenPriceDollars === undefined ? PLACEHOLDER_KEY : `$${tokenPriceDollars.toFormat(2)}`,
      },
      {
        label: t('market.marketInfo.stats.marketLiquidityLabel'),
        value: formatCentsToReadableValue({
          value: liquidityCents,
        }),
      },
      {
        label: t('market.marketInfo.stats.supplierCountLabel'),
        value: supplierCount ?? '-',
      },
      {
        label: t('market.marketInfo.stats.borrowerCountLabel'),
        value: borrowerCount ?? '-',
      },
      {
        label: t('market.marketInfo.stats.borrowCapLabel'),
        value: borrowCapTokens?.isEqualTo(0)
          ? t('market.marketInfo.stats.unlimitedBorrowCap')
          : formatTokensToReadableValue({
              value: borrowCapTokens,
              minimizeDecimals: true,
              token: vToken,
            }),
      },
      {
        label: t('market.marketInfo.stats.dailySupplyingInterestsLabel'),
        value: formatCentsToReadableValue({
          value: dailySupplyingInterestsCents,
        }),
      },
      {
        label: t('market.marketInfo.stats.dailyBorrowingInterestsLabel'),
        value: formatCentsToReadableValue({
          value: dailyBorrowingInterestsCents,
        }),
      },
      {
        label: t('market.marketInfo.stats.dailyDistributionXvs'),
        value: formatTokensToReadableValue({
          value: dailyDistributionXvs,
          minimizeDecimals: true,
          addSymbol: false,
          token: TOKENS.xvs,
        }),
      },
      {
        label: t('market.marketInfo.stats.reserveTokensLabel'),
        value: formatTokensToReadableValue({
          value: reserveTokens,
          minimizeDecimals: true,
          token: vToken.underlyingToken,
        }),
      },
      {
        label: t('market.marketInfo.stats.reserveFactorLabel'),
        value: formatToReadablePercentage(reserveFactor),
      },
      {
        label: t('market.marketInfo.stats.collateralFactorLabel'),
        value: formatToReadablePercentage(collateralFactor),
      },
      {
        label: t('market.marketInfo.stats.mintedTokensLabel', {
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
        label: t('market.marketInfo.stats.exchangeRateLabel'),
        value: exchangeRateVTokens
          ? t('market.marketInfo.stats.exchangeRateValue', {
              tokenSymbol: vToken.underlyingToken.symbol,
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
      vToken,
      reserveFactor?.toFixed(),
      collateralFactor?.toFixed(),
      mintedTokens?.toFixed(),
      exchangeRateVTokens?.toFixed(),
    ],
  );

  if (!supplyChartData.length || !borrowChartData.length || !interestRateChartData.length) {
    return <Spinner />;
  }

  // TODO: handle fetching errors

  const buttonsDom = (
    <>
      <Button
        fullWidth
        css={styles.statsColumnButton}
        onClick={() => openSupplyWithdrawModal(vToken)}
      >
        {t('market.supplyButtonLabel')}
      </Button>

      <SecondaryButton
        fullWidth
        css={styles.statsColumnButton}
        onClick={() => openBorrowRepayModal(vToken)}
      >
        {t('market.borrowButtonLabel')}
      </SecondaryButton>
    </>
  );

  return (
    <>
      <div css={styles.container}>
        <Paper css={[styles.statsColumnButtonContainer, showXlDownCss]}>{buttonsDom}</Paper>

        <div css={[styles.column, styles.graphsColumn]}>
          <Card
            testId={TEST_IDS.supplyInfo}
            title={t('market.supplyInfo.title')}
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
            title={t('market.borrowInfo.title')}
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
            title={t('market.interestRateModel.title')}
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
          <Paper css={[styles.statsColumnButtonContainer, hideXlDownCss]}>{buttonsDom}</Paper>

          <MarketInfo stats={marketInfoStats} testId={TEST_IDS.marketInfo} />
        </div>
      </div>

      <BorrowRepayModal />
      <SupplyWithdrawModal />
    </>
  );
};

export type MarketProps = RouteComponentProps<{ vTokenAddress: string }>;

const Market: React.FC<MarketProps> = ({
  match: {
    params: { vTokenAddress },
  },
}) => {
  const vToken = getVTokenByAddress(vTokenAddress);

  // Redirect to markets page if params are invalid
  if (!vToken) {
    return <Redirect to={routes.pools.path} />;
  }

  const { reserveFactorMantissa, ...marketData } = useGetMarketData({
    vToken,
  });

  const chartData = useGetChartData({
    vToken,
  });

  const {
    data: interestRateChartData = {
      apySimulations: [],
    },
  } = useGetVTokenApySimulations({
    vToken,
    reserveFactorMantissa,
  });

  return (
    <MarketUi
      vToken={vToken}
      {...marketData}
      {...chartData}
      interestRateChartData={interestRateChartData.apySimulations}
    />
  );
};

export default Market;
