/** @jsxImportSource @emotion/react */
import { Paper } from '@mui/material';
import BigNumber from 'bignumber.js';
import { Button, SecondaryButton, Spinner } from 'components';
import { useTranslation } from 'packages/translations';
import React, { useMemo } from 'react';
import { Asset, Token } from 'types';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
  getCombinedDistributionApys,
} from 'utilities';

import { useGetVTokenApySimulations } from 'clients/api';
import { ApyChart, ApyChartProps } from 'components/charts/ApyChart';
import { InterestRateChart, InterestRateChartProps } from 'components/charts/InterestRateChart';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { useHideXlDownCss, useShowXlDownCss } from 'hooks/responsive';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import useIsTokenActionEnabled from 'hooks/useIsTokenActionEnabled';
import useOperationModal from 'hooks/useOperationModal';

import Card, { CardProps } from './Card';
import MarketInfo, { MarketInfoProps } from './MarketInfo';
import { useStyles } from './styles';
import TEST_IDS from './testIds';
import useGetChartData from './useGetChartData';

export interface MarketUiProps {
  isChartDataLoading: boolean;
  supplyChartData: ApyChartProps['data'];
  borrowChartData: ApyChartProps['data'];
  interestRateChartData: InterestRateChartProps['data'];
  isInterestRateChartDataLoading: boolean;
  poolComptrollerAddress: string;
  currentUtilizationRatePercentage: number;
  asset: Asset;
  isBorrowActionEnabled: boolean;
  isSupplyActionEnabled: boolean;
  blocksPerDay: number;
}

export const MarketUi: React.FC<MarketUiProps> = ({
  asset,
  isChartDataLoading,
  poolComptrollerAddress,
  supplyChartData,
  borrowChartData,
  isInterestRateChartDataLoading,
  interestRateChartData,
  currentUtilizationRatePercentage,
  isBorrowActionEnabled,
  isSupplyActionEnabled,
  blocksPerDay,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const hideXlDownCss = useHideXlDownCss();
  const showXlDownCss = useShowXlDownCss();

  const { openOperationModal, OperationModal } = useOperationModal();

  const { dailySupplyInterestsCents, dailyBorrowInterestsCents } = useMemo(
    () => ({
      // Calculate daily interests for suppliers and borrowers. Note that we don't
      // use BigNumber to calculate these values, as this would slow down
      // calculation a lot while the end result doesn't need to be extremely
      // precise

      // prettier-ignore
      dailySupplyInterestsCents: asset && +asset.supplyBalanceCents * (((1 + asset.supplyPercentageRatePerBlock.toNumber()) ** blocksPerDay) - 1),
      // prettier-ignore
      dailyBorrowInterestsCents: asset && +asset.borrowBalanceCents * (((1 + asset.borrowPercentageRatePerBlock.toNumber()) ** blocksPerDay) - 1),
    }),
    [asset, blocksPerDay],
  );

  const isSupplyOrBorrowEnabled = isSupplyActionEnabled || isBorrowActionEnabled;

  const distributionApys = useMemo(() => asset && getCombinedDistributionApys({ asset }), [asset]);

  const supplyInfoStats: CardProps['stats'] = React.useMemo(() => {
    if (!asset) {
      return [];
    }

    const stats: CardProps['stats'] = [
      {
        label: t('market.supplyInfo.stats.totalSupply'),
        value: formatCentsToReadableValue({
          value: asset.supplyBalanceCents,
        }),
      },
      {
        label: t('market.supplyInfo.stats.apy'),
        value: formatPercentageToReadableValue(asset.supplyApyPercentage),
      },
    ];

    if (distributionApys) {
      stats.push({
        label: t('market.supplyInfo.stats.distributionApy'),
        value: formatPercentageToReadableValue(distributionApys.supplyApyRewardsPercentage),
      });
    }

    return stats;
  }, [asset, distributionApys, t]);

  const supplyInfoLegends: CardProps['legends'] = [
    {
      label: t('market.legends.supplyApy'),
      color: styles.legendColors.supplyApy,
    },
  ];

  const borrowInfoStats: CardProps['stats'] = React.useMemo(() => {
    if (!asset) {
      return [];
    }

    const stats: CardProps['stats'] = [
      {
        label: t('market.borrowInfo.stats.totalBorrow'),
        value: formatCentsToReadableValue({
          value: asset.borrowBalanceCents,
        }),
      },
      {
        label: t('market.borrowInfo.stats.apy'),
        value: formatPercentageToReadableValue(asset.borrowApyPercentage),
      },
    ];

    if (distributionApys) {
      stats.push({
        label: t('market.supplyInfo.stats.distributionApy'),
        value: formatPercentageToReadableValue(distributionApys.borrowApyRewardsPercentage),
      });
    }

    return stats;
  }, [asset, t, distributionApys]);

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

  const marketInfoStats: MarketInfoProps['stats'] = React.useMemo(() => {
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

      if (!Object.hasOwn(accCopy, distribution.token.address)) {
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
      {
        label: t('market.marketInfo.stats.supplierCountLabel'),
        value: asset.supplierCount ?? '-',
      },
      {
        label: t('market.marketInfo.stats.borrowerCountLabel'),
        value: asset.borrowerCount ?? '-',
      },
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
  }, [asset, t, dailySupplyInterestsCents, dailyBorrowInterestsCents]);

  const buttonsDom = (
    <>
      {isSupplyActionEnabled && (
        <Button
          className="mx-3 w-full first:ml-0 last:mr-0"
          onClick={() =>
            openOperationModal({
              vToken: asset.vToken,
              poolComptrollerAddress,
              initialActiveTabIndex: 0,
            })
          }
        >
          {t('market.supplyButtonLabel')}
        </Button>
      )}
      {isBorrowActionEnabled && (
        <SecondaryButton
          className="mx-3 w-full first:ml-0 last:mr-0"
          onClick={() =>
            openOperationModal({
              vToken: asset.vToken,
              poolComptrollerAddress,
              initialActiveTabIndex: 2,
            })
          }
        >
          {t('market.borrowButtonLabel')}
        </SecondaryButton>
      )}
    </>
  );

  return (
    <>
      <div css={styles.container}>
        {isSupplyOrBorrowEnabled && (
          <Paper css={[styles.statsColumnButtonContainer, showXlDownCss]}>{buttonsDom}</Paper>
        )}

        <div css={[styles.column, styles.graphsColumn]}>
          <Card
            testId={TEST_IDS.supplyInfo}
            title={t('market.supplyInfo.title')}
            css={styles.graphCard}
            stats={supplyInfoStats}
            legends={supplyInfoLegends}
          >
            {isChartDataLoading && supplyChartData.length === 0 && <Spinner />}
            {supplyChartData.length > 0 && (
              <div css={styles.apyChart}>
                <ApyChart data={supplyChartData} type="supply" />
              </div>
            )}
          </Card>

          <Card
            testId={TEST_IDS.borrowInfo}
            title={t('market.borrowInfo.title')}
            css={styles.graphCard}
            stats={borrowInfoStats}
            legends={borrowInfoLegends}
          >
            {isChartDataLoading && borrowChartData.length === 0 && <Spinner />}
            {borrowChartData.length > 0 && (
              <div css={styles.apyChart}>
                <ApyChart data={borrowChartData} type="borrow" />
              </div>
            )}
          </Card>

          <Card
            testId={TEST_IDS.interestRateModel}
            title={t('market.interestRateModel.title')}
            css={styles.graphCard}
            legends={interestRateModelLegends}
          >
            {isInterestRateChartDataLoading && interestRateChartData.length === 0 && <Spinner />}
            {interestRateChartData.length > 0 && (
              <div css={styles.apyChart}>
                <InterestRateChart
                  data={interestRateChartData}
                  currentUtilizationRatePercentage={currentUtilizationRatePercentage}
                />
              </div>
            )}
          </Card>
        </div>

        <div css={[styles.column, styles.statsColumn]}>
          {isSupplyOrBorrowEnabled && (
            <Paper css={[styles.statsColumnButtonContainer, hideXlDownCss]}>{buttonsDom}</Paper>
          )}

          <MarketInfo stats={marketInfoStats} testId={TEST_IDS.marketInfo} />
        </div>
      </div>

      <OperationModal />
    </>
  );
};

interface MarketProps {
  poolComptrollerAddress: string;
  asset: Asset;
  isIsolatedPoolMarket: boolean;
}

const Market: React.FC<MarketProps> = ({
  poolComptrollerAddress,
  asset,
  isIsolatedPoolMarket = false,
}) => {
  const { blocksPerDay } = useGetChainMetadata();

  const { data: chartData, isLoading: isChartDataLoading } = useGetChartData({
    vToken: asset.vToken,
  });

  const {
    isLoading: isInterestRateChartDataLoading,
    data: interestRateChartData = {
      apySimulations: [],
      currentUtilizationRatePercentage: 0,
    },
  } = useGetVTokenApySimulations({
    vToken: asset.vToken,
    isIsolatedPoolMarket,
    asset,
  });

  const isBorrowActionEnabled = useIsTokenActionEnabled({
    tokenAddress: asset.vToken.underlyingToken.address,
    action: 'borrow',
  });

  const isSupplyActionEnabled = useIsTokenActionEnabled({
    tokenAddress: asset.vToken.underlyingToken.address,
    action: 'supply',
  });

  return (
    <MarketUi
      asset={asset}
      blocksPerDay={blocksPerDay}
      poolComptrollerAddress={poolComptrollerAddress}
      isChartDataLoading={isChartDataLoading}
      {...chartData}
      isInterestRateChartDataLoading={isInterestRateChartDataLoading}
      interestRateChartData={interestRateChartData.apySimulations}
      currentUtilizationRatePercentage={interestRateChartData.currentUtilizationRatePercentage}
      isBorrowActionEnabled={isBorrowActionEnabled}
      isSupplyActionEnabled={isSupplyActionEnabled}
    />
  );
};

export default Market;
