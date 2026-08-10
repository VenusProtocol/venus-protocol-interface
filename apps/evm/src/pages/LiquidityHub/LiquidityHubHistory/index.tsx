import BigNumber from 'bignumber.js';

import { liquidityHubSnapshots } from '__mocks__/models/liquidityHubSnapshots';
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
import type { LiquidityHub } from 'types';
import {
  type LiquidityHubHistoryPeriod,
  formatCentsToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';
import { UnitPriceChart } from './UnitPriceChart';
import { formatUnitPriceToReadableValue } from './formatUnitPriceToReadableValue';
export interface LiquidityHubHistoryProps {
  liquidityHub: LiquidityHub;
}

export const LiquidityHubHistory: React.FC<LiquidityHubHistoryProps> = ({ liquidityHub }) => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<LiquidityHubHistoryPeriod>('1m');

  const isApyChartsFeatureEnabled = useIsFeatureEnabled({ name: 'apyCharts' });
  const isLoading = false;

  const periodOptions: MarketHistoryCardPeriodOption<LiquidityHubHistoryPeriod>[] = [
    {
      label: t('liquidityHub.periodOption.oneWeek'),
      value: '1w',
    },
    {
      label: t('liquidityHub.periodOption.thirtyDays'),
      value: '1m',
    },
    {
      label: t('liquidityHub.periodOption.threeMonths'),
      value: '3m',
    },
    {
      label: t('liquidityHub.periodOption.oneYear'),
      value: '1y',
    },
    {
      label: t('liquidityHub.periodOption.all'),
      value: 'all',
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
          data: liquidityHubSnapshots,
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
          <UnitPriceChart data={liquidityHubSnapshots} selectedPeriod={selectedPeriod} />
        )}
      </MarketCard>
    </div>
  );
};
