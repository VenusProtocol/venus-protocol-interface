import BigNumber from 'bignumber.js';

import { liquidityHubSnapshots } from '__mocks__/models/liquidityHubSnapshots';
import type { MarketHistoryPeriodType } from 'clients/api';
import {
  Apy,
  ButtonGroup,
  MarketCard,
  MarketHistoryCard,
  type MarketHistoryCardPeriodOption,
  Spinner,
} from 'components';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import type { LiquidityHub, MarketHistoryDataPoint } from 'types';
import { formatCentsToReadableValue, formatTokensToReadableValue } from 'utilities';
import { UnitPriceChart, type UnitPriceHistoryDataPoint } from './UnitPriceChart';
import { formatUnitPriceToReadableValue } from './formatUnitPriceToReadableValue';
export interface LiquidityHubHistoryProps {
  liquidityHub: LiquidityHub;
}

export const LiquidityHubHistory: React.FC<LiquidityHubHistoryProps> = ({ liquidityHub }) => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<MarketHistoryPeriodType>('month');

  const isApyChartsFeatureEnabled = useIsFeatureEnabled({ name: 'apyCharts' });

  // TODO: fetch data from API
  const supplyChartData: MarketHistoryDataPoint[] = liquidityHubSnapshots.map(snapshot => ({
    apyPercentage: +snapshot.supplyApy,
    timestampMs: Number(snapshot.blockTimestamp) * 1000,
    balanceCents: new BigNumber(snapshot.totalSupplyCents),
  }));

  const unitPriceChartData: UnitPriceHistoryDataPoint[] = liquidityHubSnapshots.map(snapshot => ({
    unitPrice: +snapshot.pricePerShare,
    timestampMs: Number(snapshot.blockTimestamp) * 1000,
  }));

  const isLoading = false;

  const periodOptions: MarketHistoryCardPeriodOption[] = [
    {
      label: t('market.periodOption.thirtyDays'),
      value: 'month',
    },
    {
      label: t('market.periodOption.sixMonths'),
      value: 'halfyear',
    },
    {
      label: t('market.periodOption.oneYear'),
      value: 'year',
    },
  ];

  const availableSupplyTokens = liquidityHub.supplyCapTokens.minus(
    liquidityHub.supplyBalanceTokens,
  );

  const safeAvailableSupplyTokens = availableSupplyTokens.isLessThanOrEqualTo(0)
    ? new BigNumber(0)
    : availableSupplyTokens;

  const supplyCapTooltip = t('market.supplyCapThreshold.tooltip', {
    amountDollars: formatCentsToReadableValue({
      value: safeAvailableSupplyTokens.multipliedBy(liquidityHub.tokenPriceCents),
    }),
    amountTokens: formatTokensToReadableValue({
      value: safeAvailableSupplyTokens,
      token: liquidityHub.vhToken.underlyingToken,
    }),
  });

  const readableUnitPrice = formatUnitPriceToReadableValue(liquidityHub.pricePerShare);

  const shouldDisplayHistory = isApyChartsFeatureEnabled && liquidityHubSnapshots.length > 0;

  return (
    <div className="space-y-6">
      <MarketHistoryCard
        title={t('market.supplyInfo.title')}
        cells={[
          {
            label: t('market.stats.apy'),
            value: (
              <Apy
                type="supply"
                token={liquidityHub.vhToken.underlyingToken}
                baseApyPercentage={liquidityHub.supplyApyPercentage}
                tokenDistributions={liquidityHub.supplyTokenDistributions}
                userBalanceTokens={liquidityHub.userSupplyBalanceTokens}
              />
            ),
          },
        ]}
        cap={{
          token: liquidityHub.vhToken.underlyingToken,
          title: t('market.supplyCapThreshold.title'),
          tokenPriceCents: liquidityHub.tokenPriceCents,
          limitTokens: liquidityHub.supplyCapTokens,
          valueTokens: liquidityHub.supplyBalanceTokens,
          tooltip: <span className="whitespace-pre-line">{supplyCapTooltip}</span>,
        }}
        history={{
          type: 'supply',
          data: supplyChartData,
          isLoading: false,
          selectedPeriod,
          setSelectedPeriod,
          periodOptions,
        }}
      />

      <MarketCard
        title={t('market.positionUnitPrice', { vhTokenSymbol: liquidityHub.vhToken.symbol })}
        topContent={<p className="text-h6 -mt-3">{readableUnitPrice}</p>}
        rightContent={
          shouldDisplayHistory ? (
            <ButtonGroup
              buttonSize="xs"
              buttonLabels={periodOptions.map(periodOption => periodOption.label)}
              activeButtonIndex={periodOptions.findIndex(
                periodOption => periodOption.value === selectedPeriod,
              )}
              onButtonClick={index => {
                const periodOption = periodOptions[index];

                if (periodOption) {
                  setSelectedPeriod(periodOption.value);
                }
              }}
            />
          ) : undefined
        }
      >
        {isLoading && liquidityHubSnapshots.length === 0 && <Spinner />}

        {shouldDisplayHistory && (
          <UnitPriceChart data={unitPriceChartData} selectedPeriod={selectedPeriod} />
        )}
      </MarketCard>
    </div>
  );
};
