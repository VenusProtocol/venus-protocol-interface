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
import React, { useMemo } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import {
  formatCentsToReadableValue,
  formatToReadablePercentage,
  formatTokensToReadableValue,
  getVTokenByAddress,
} from 'utilities';

import { useGetAsset, useGetVTokenApySimulations } from 'clients/api';
import { BLOCKS_PER_DAY } from 'constants/bsc';
import { COMPOUND_MANTISSA } from 'constants/compoundMantissa';
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

export interface MarketUiProps {
  supplyChartData: ApyChartProps['data'];
  borrowChartData: ApyChartProps['data'];
  interestRateChartData: InterestRateChartProps['data'];
  asset?: Asset;
}

export const MarketUi: React.FC<MarketUiProps> = ({
  asset,
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

  const { currentUtilizationRate, dailySupplyInterestsCents, dailyBorrowInterestsCents } = useMemo(
    () => ({
      currentUtilizationRate:
        asset &&
        asset.borrowBalanceTokens
          .div(asset.cashTokens.plus(asset.borrowBalanceTokens).minus(asset.reserveTokens))
          .multipliedBy(100)
          .dp(0)
          .toNumber(),
      // Calculate daily interests for suppliers and borrowers. Note that we don't
      // use BigNumber to calculate these values, as this would slow down
      // calculation a lot while the end result doesn't need to be extremely
      // precise

      // prettier-ignore
      dailySupplyInterestsCents: asset && +asset.supplyBalanceCents * (((1 + asset.supplyRatePerBlockTokens.toNumber()) ** BLOCKS_PER_DAY) - 1),
      // prettier-ignore
      dailyBorrowInterestsCents: asset && +asset.borrowBalanceCents * (((1 + asset.borrowRatePerBlockTokens.toNumber()) ** BLOCKS_PER_DAY) - 1),
    }),
    [
      asset?.supplyRatePerBlockTokens,
      asset?.supplyBalanceCents,
      asset?.borrowRatePerBlockTokens,
      asset?.borrowRatePerBlockTokens,
    ],
  );

  const supplyInfoStats: CardProps['stats'] = React.useMemo(
    () =>
      asset
        ? [
            {
              label: t('market.supplyInfo.stats.totalSupply'),
              value: formatCentsToReadableValue({
                value: asset.supplyBalanceCents,
                shortenLargeValue: true,
              }),
            },
            {
              label: t('market.supplyInfo.stats.apy'),
              value: formatToReadablePercentage(asset?.supplyApyPercentage),
            },
            {
              label: t('market.supplyInfo.stats.distributionApy'),
              value: formatToReadablePercentage(asset.xvsSupplyApy),
            },
          ]
        : [],
    [asset?.supplyApyPercentage, asset?.supplyApyPercentage, asset?.xvsSupplyApy],
  );

  const supplyInfoLegends: CardProps['legends'] = [
    {
      label: t('market.legends.supplyApy'),
      color: styles.legendColors.supplyApy,
    },
  ];

  const borrowInfoStats: CardProps['stats'] = React.useMemo(
    () =>
      asset
        ? [
            {
              label: t('market.borrowInfo.stats.totalBorrow'),
              value: formatCentsToReadableValue({
                value: asset.borrowBalanceCents,
                shortenLargeValue: true,
              }),
            },
            {
              label: t('market.borrowInfo.stats.apy'),
              value: formatToReadablePercentage(asset.borrowApyPercentage),
            },
            {
              label: t('market.borrowInfo.stats.distributionApy'),
              value: formatToReadablePercentage(asset.xvsBorrowApy),
            },
          ]
        : [],
    [asset?.borrowBalanceCents, asset?.borrowApyPercentage, asset?.xvsBorrowApy],
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
    () =>
      asset
        ? [
            {
              label: t('market.marketInfo.stats.priceLabel'),
              value: asset.tokenPriceDollars
                ? `$${asset.tokenPriceDollars.toFormat(2)}`
                : PLACEHOLDER_KEY,
            },
            {
              label: t('market.marketInfo.stats.marketLiquidityLabel'),
              value: formatCentsToReadableValue({
                value: asset.liquidityCents,
              }),
            },
            {
              label: t('market.marketInfo.stats.supplierCountLabel'),
              value: asset.supplierCount ?? '-',
            },
            {
              label: t('market.marketInfo.stats.borrowerCountLabel'),
              value: asset.borrowerCount ?? '-',
            },
            {
              label: t('market.marketInfo.stats.borrowCapLabel'),
              value: asset.borrowCapTokens.isEqualTo(0)
                ? t('market.marketInfo.stats.unlimitedBorrowCap')
                : formatTokensToReadableValue({
                    value: asset.borrowCapTokens,
                    minimizeDecimals: true,
                    token: asset.vToken,
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
            {
              label: t('market.marketInfo.stats.dailyDistributionXvs'),
              value: formatTokensToReadableValue({
                value: asset.xvsPerDay,
                minimizeDecimals: true,
                addSymbol: false,
                token: TOKENS.xvs,
              }),
            },
            {
              label: t('market.marketInfo.stats.reserveTokensLabel'),
              value: formatTokensToReadableValue({
                value: asset.reserveTokens,
                minimizeDecimals: true,
                token: asset.vToken.underlyingToken,
              }),
            },
            {
              label: t('market.marketInfo.stats.reserveFactorLabel'),
              value: formatToReadablePercentage(asset.reserveFactor && asset.reserveFactor * 100),
            },
            {
              label: t('market.marketInfo.stats.collateralFactorLabel'),
              value: formatToReadablePercentage(
                asset.collateralFactor && asset.collateralFactor * 100,
              ),
            },
            {
              label: t('market.marketInfo.stats.mintedTokensLabel', {
                vTokenSymbol: asset.vToken.symbol,
              }),
              value: formatTokensToReadableValue({
                value: asset.supplyBalanceTokens.multipliedBy(asset.exchangeRateVTokens),
                minimizeDecimals: true,
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
          ]
        : [],
    [
      asset?.tokenPriceDollars,
      asset?.liquidityCents,
      asset?.supplierCount,
      asset?.borrowerCount,
      asset?.borrowCapTokens,
      asset?.vToken,
      asset?.xvsPerDay,
      asset?.reserveTokens,
      asset?.reserveFactor,
      asset?.collateralFactor,
      asset?.supplyBalanceTokens,
      asset?.exchangeRateVTokens,
      dailySupplyInterestsCents,
      dailyBorrowInterestsCents,
    ],
  );

  if (
    !asset ||
    !supplyChartData.length ||
    !borrowChartData.length ||
    !interestRateChartData.length
  ) {
    return <Spinner />;
  }

  const buttonsDom = (
    <>
      <Button
        fullWidth
        css={styles.statsColumnButton}
        onClick={() => openSupplyWithdrawModal(asset.vToken)}
      >
        {t('market.supplyButtonLabel')}
      </Button>

      <SecondaryButton
        fullWidth
        css={styles.statsColumnButton}
        onClick={() => openBorrowRepayModal(asset.vToken)}
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

// TODO: add poolComptrollerAddress
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

  const {
    data: { asset },
  } = useGetAsset({
    vToken,
  });

  const chartData = useGetChartData({
    vToken,
  });

  const reserveFactorMantissa = useMemo(
    () => asset && new BigNumber(asset.reserveFactor).multipliedBy(COMPOUND_MANTISSA),
    [asset?.reserveFactor],
  );

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
      asset={asset}
      {...chartData}
      interestRateChartData={interestRateChartData.apySimulations}
    />
  );
};

export default Market;
