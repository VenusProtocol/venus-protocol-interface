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
import { Asset, Token, VToken } from 'types';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
  getCombinedDistributionApys,
  getVTokenByAddress,
  isTokenActionEnabled,
} from 'utilities';

import { useGetAsset, useGetVTokenApySimulations } from 'clients/api';
import { BLOCKS_PER_DAY } from 'constants/bsc';
import { COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { routes } from 'constants/routing';
import { useAuth } from 'context/AuthContext';
import { useHideXlDownCss, useShowXlDownCss } from 'hooks/responsive';
import useGetUniqueContractAddress from 'hooks/useGetUniqueContractAddress';
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
  asset?: Asset;
  currentUtilizationRate: number;
}

export const MarketUi: React.FC<MarketUiProps> = ({
  asset,
  isChartDataLoading,
  poolComptrollerAddress,
  supplyChartData,
  borrowChartData,
  isInterestRateChartDataLoading,
  interestRateChartData,
  currentUtilizationRate,
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
      dailySupplyInterestsCents: asset && +asset.supplyBalanceCents * (((1 + asset.supplyPercentageRatePerBlock.toNumber()) ** BLOCKS_PER_DAY) - 1),
      // prettier-ignore
      dailyBorrowInterestsCents: asset && +asset.borrowBalanceCents * (((1 + asset.borrowPercentageRatePerBlock.toNumber()) ** BLOCKS_PER_DAY) - 1),
    }),
    [
      asset?.supplyPercentageRatePerBlock,
      asset?.supplyBalanceCents,
      asset?.borrowPercentageRatePerBlock,
      asset?.borrowPercentageRatePerBlock,
    ],
  );

  const isSupplyOrBorrowEnabled = React.useMemo(
    () =>
      asset &&
      (isTokenActionEnabled({ token: asset.vToken.underlyingToken, action: 'supply' }) ||
        isTokenActionEnabled({ token: asset.vToken.underlyingToken, action: 'borrow' })),
    [asset?.vToken.underlyingToken],
  );

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
        value: formatPercentageToReadableValue(asset?.supplyApyPercentage),
      },
    ];

    if (distributionApys) {
      stats.push({
        label: t('market.supplyInfo.stats.distributionApy'),
        value: formatPercentageToReadableValue(distributionApys.supplyApyPercentage),
      });
    }

    return stats;
  }, [asset?.supplyApyPercentage, asset?.supplyApyPercentage, distributionApys]);

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
        value: formatPercentageToReadableValue(distributionApys.borrowApyPercentage),
      });
    }

    return stats;
  }, [asset?.borrowBalanceCents, asset?.borrowApyPercentage, distributionApys]);

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
      const accCopy = { ...accDistributionMapping };

      if (!Object.hasOwnProperty.call(accCopy, distribution.token.address)) {
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
  }, [
    asset?.tokenPriceCents,
    asset?.liquidityCents,
    asset?.supplierCount,
    asset?.borrowerCount,
    asset?.borrowCapTokens,
    asset?.vToken,
    asset?.supplyDistributions,
    asset?.borrowDistributions,
    asset?.reserveTokens,
    asset?.reserveFactor,
    asset?.collateralFactor,
    asset?.supplyBalanceTokens,
    asset?.exchangeRateVTokens,
    dailySupplyInterestsCents,
    dailyBorrowInterestsCents,
  ]);

  if (!asset) {
    return <Spinner />;
  }

  const buttonsDom = (
    <>
      {isTokenActionEnabled({ token: asset.vToken.underlyingToken, action: 'supply' }) && (
        <Button
          fullWidth
          css={styles.statsColumnButton}
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
      {isTokenActionEnabled({ token: asset.vToken.underlyingToken, action: 'borrow' }) && (
        <SecondaryButton
          fullWidth
          css={styles.statsColumnButton}
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
                  currentUtilizationRate={currentUtilizationRate}
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
  vToken: VToken;
  isIsolatedPoolMarket: boolean;
  poolComptrollerAddress: string;
}

const Market: React.FC<MarketProps> = ({
  vToken,
  isIsolatedPoolMarket,
  poolComptrollerAddress,
}) => {
  const { accountAddress } = useAuth();

  const { data: getAssetData } = useGetAsset({
    vToken,
    accountAddress,
  });
  const asset = getAssetData?.asset;

  const { data: chartData, isLoading: isChartDataLoading } = useGetChartData({
    vToken,
  });

  const reserveFactorMantissa = useMemo(
    () => asset && new BigNumber(asset.reserveFactor).multipliedBy(COMPOUND_MANTISSA),
    [asset?.reserveFactor],
  );

  const {
    isLoading: isInterestRateChartDataLoading,
    data: interestRateChartData = {
      apySimulations: [],
      currentUtilizationRate: 0,
    },
  } = useGetVTokenApySimulations({
    vToken,
    isIsolatedPoolMarket,
    reserveFactorMantissa,
    asset,
  });

  return (
    <MarketUi
      asset={asset}
      poolComptrollerAddress={poolComptrollerAddress}
      isChartDataLoading={isChartDataLoading}
      {...chartData}
      isInterestRateChartDataLoading={isInterestRateChartDataLoading}
      interestRateChartData={interestRateChartData.apySimulations}
      currentUtilizationRate={interestRateChartData.currentUtilizationRate}
    />
  );
};

export type CorePoolMarketProps = RouteComponentProps<{
  vTokenAddress: string;
}>;

export const CorePoolMarket: React.FC<CorePoolMarketProps> = ({
  match: {
    params: { vTokenAddress },
  },
}) => {
  const mainPoolComptrollerContractAddress = useGetUniqueContractAddress({
    name: 'mainPoolComptroller',
  });

  const vToken = getVTokenByAddress(vTokenAddress);

  // Redirect to dashboard page if params are invalid
  if (!vToken || !mainPoolComptrollerContractAddress) {
    return <Redirect to={routes.dashboard.path} />;
  }

  return (
    <Market
      vToken={vToken}
      isIsolatedPoolMarket={false}
      poolComptrollerAddress={mainPoolComptrollerContractAddress}
    />
  );
};

export type IsolatedMarketProps = RouteComponentProps<{
  vTokenAddress: string;
  poolComptrollerAddress: string;
}>;

export const IsolatedPoolMarket: React.FC<IsolatedMarketProps> = ({
  match: {
    params: { vTokenAddress, poolComptrollerAddress },
  },
}) => {
  const vToken = getVTokenByAddress(vTokenAddress);

  // Redirect to dashboard page if params are invalid
  if (!vToken || !poolComptrollerAddress) {
    return <Redirect to={routes.dashboard.path} />;
  }

  return (
    <Market vToken={vToken} isIsolatedPoolMarket poolComptrollerAddress={poolComptrollerAddress} />
  );
};
