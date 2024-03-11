import { Paper } from '@mui/material';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useGetVTokenApySimulations } from 'clients/api';
import { Button, Card, SecondaryButton, Spinner } from 'components';
import { InterestRateChart, InterestRateChartProps } from 'components/charts/InterestRateChart';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import useIsTokenActionEnabled from 'hooks/useIsTokenActionEnabled';
import useOperationModal from 'hooks/useOperationModal';
import { useTranslation } from 'libs/translations';
import { Asset, Token } from 'types';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

import { MarketCard, MarketCardProps } from './MarketCard';
import { MarketHistory } from './MarketHistory';
import MarketInfo, { MarketInfoProps } from './MarketInfo';
import TEST_IDS from './testIds';

export interface MarketUiProps {
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
  poolComptrollerAddress,
  isInterestRateChartDataLoading,
  interestRateChartData,
  currentUtilizationRatePercentage,
  isBorrowActionEnabled,
  isSupplyActionEnabled,
  blocksPerDay,
}) => {
  const { t } = useTranslation();

  const isMarketParticipantCountFeatureEnabled = useIsFeatureEnabled({
    name: 'marketParticipantCounts',
  });
  const isMarketHistoryFeatureEnabled = useIsFeatureEnabled({
    name: 'marketHistory',
  });

  const { openOperationModal, OperationModal } = useOperationModal();

  const { dailySupplyInterestsCents, dailyBorrowInterestsCents } = useMemo(
    () => ({
      // Calculate daily interests for suppliers and borrowers. Note that we don't
      // use BigNumber to calculate these values, as this would slow down
      // calculation a lot while the end result doesn't need to be extremely
      // precise

      // prettier-ignore
      dailySupplyInterestsCents:
        asset &&
        +asset.supplyBalanceCents *
          ((1 + asset.supplyPercentageRatePerBlock.toNumber()) ** blocksPerDay - 1),
      // prettier-ignore
      dailyBorrowInterestsCents:
        asset &&
        +asset.borrowBalanceCents *
          ((1 + asset.borrowPercentageRatePerBlock.toNumber()) ** blocksPerDay - 1),
    }),
    [asset, blocksPerDay],
  );

  const isSupplyOrBorrowEnabled = isSupplyActionEnabled || isBorrowActionEnabled;

  const interestRateModelLegends: MarketCardProps['legends'] = [
    {
      label: t('market.legends.utilizationRate'),
      color: 'blue',
    },
    {
      label: t('market.legends.borrowApy'),
      color: 'red',
    },
    {
      label: t('market.legends.supplyApy'),
      color: 'green',
    },
  ];

  const marketInfoStats: MarketInfoProps['stats'] = useMemo(() => {
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

      if (!Object.prototype.hasOwnProperty.call(accCopy, distribution.token.address)) {
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

    const participantCountRows = isMarketParticipantCountFeatureEnabled
      ? [
          {
            label: t('market.marketInfo.stats.supplierCountLabel'),
            value: asset.supplierCount ?? '-',
          },
          {
            label: t('market.marketInfo.stats.borrowerCountLabel'),
            value: asset.borrowerCount ?? '-',
          },
        ]
      : [];

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
      ...participantCountRows,
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
    asset,
    t,
    dailySupplyInterestsCents,
    dailyBorrowInterestsCents,
    isMarketParticipantCountFeatureEnabled,
  ]);

  const buttonsDom = (
    <div className="flex items-center space-x-4">
      {isSupplyActionEnabled && (
        <Button
          className="w-full"
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
          className="w-full"
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
    </div>
  );

  return (
    <>
      <div className="space-y-6 xl:grid xl:grid-cols-3 xl:gap-8 xl:space-y-0">
        {isSupplyOrBorrowEnabled && <Card className="xl:hidden">{buttonsDom}</Card>}

        <div className="space-y-6 xl:col-span-2 xl:mt-0">
          {isMarketHistoryFeatureEnabled && <MarketHistory asset={asset} />}

          <MarketCard
            testId={TEST_IDS.interestRateModel}
            title={t('market.interestRateModel.title')}
            legends={interestRateModelLegends}
          >
            {isInterestRateChartDataLoading && interestRateChartData.length === 0 && <Spinner />}
            {interestRateChartData.length > 0 && (
              <div className="-mr-[10px]">
                <InterestRateChart
                  data={interestRateChartData}
                  currentUtilizationRatePercentage={currentUtilizationRatePercentage}
                />
              </div>
            )}
          </MarketCard>
        </div>

        <div className="xl:col-span-1 xl:space-y-6">
          {isSupplyOrBorrowEnabled && <Paper className="hidden xl:block">{buttonsDom}</Paper>}

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
      isInterestRateChartDataLoading={isInterestRateChartDataLoading}
      interestRateChartData={interestRateChartData.apySimulations}
      currentUtilizationRatePercentage={interestRateChartData.currentUtilizationRatePercentage}
      isBorrowActionEnabled={isBorrowActionEnabled}
      isSupplyActionEnabled={isSupplyActionEnabled}
    />
  );
};

export default Market;
