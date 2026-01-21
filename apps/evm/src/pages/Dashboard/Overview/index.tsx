import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import { useState } from 'react';

import {
  type AccountPerformanceHistoryDataPoint,
  type AccountPerformanceHistoryPeriod,
  useGetAccountPerformanceHistory,
  useGetPool,
  useGetTokenUsdPrice,
  useGetVaults,
} from 'clients/api';
import {
  AccordionAnimatedContent,
  ButtonGroup,
  Cell,
  CellGroup,
  type CellProps,
  Icon,
  InfoIcon,
} from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { HidableUserBalance } from 'containers/HidableUserBalance';
import { useChain } from 'hooks/useChain';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { store } from 'store';
import {
  convertDollarsToCents,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
} from 'utilities';
import { DollarValueChange } from './DollarValueChange';
import { PerformanceChart } from './PerformanceChart';
import { testIds } from './testIds';
import { useExtractData } from './useExtractData';

export interface OverviewProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Overview: React.FC<OverviewProps> = ({ ...otherProps }) => {
  const { t } = useTranslation();

  const isVaiFeatureEnabled = useIsFeatureEnabled({
    name: 'vaiRoute',
  });

  const [userChainSettings] = useUserChainSettings();

  console.log(store.use.setUserSettings());

  const setUserSettings = store.use.setUserSettings();

  const toggleShowUserBalances = () =>
    setUserSettings({
      settings: {
        doNotShowUserBalances: !userChainSettings.doNotShowUserBalances,
      },
    });

  const { corePoolComptrollerContractAddress } = useChain();
  const { accountAddress } = useAccountAddress();

  const periodOptions: { label: string; value: AccountPerformanceHistoryPeriod }[] = [
    {
      label: t('dashboard.overview.periodOption.thirtyDays'),
      value: 'month',
    },
    {
      label: t('dashboard.overview.periodOption.sixMonths'),
      value: 'halfyear',
    },
    {
      label: t('dashboard.overview.periodOption.oneYear'),
      value: 'year',
    },
  ];

  const [selectedPeriod, setSelectedPeriod] = useState<AccountPerformanceHistoryPeriod>(
    periodOptions[0].value,
  );

  const [selectedDataPoint, setSelectedDataPoint] = useState<
    AccountPerformanceHistoryDataPoint | undefined
  >();

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const toggleAccordion = () => setIsAccordionOpen(current => !current);

  const { data: getPoolData } = useGetPool({
    poolComptrollerAddress: corePoolComptrollerContractAddress,
    accountAddress,
  });
  const pool = getPoolData?.pool;

  const { data: getVaultsData } = useGetVaults({
    accountAddress,
  });
  const vaults = getVaultsData || [];

  const xvs = useGetToken({
    symbol: 'XVS',
  });
  const { data: getXvsUsdPriceData } = useGetTokenUsdPrice({
    token: xvs,
  });
  const xvsPriceCents =
    getXvsUsdPriceData && convertDollarsToCents(getXvsUsdPriceData.tokenPriceUsd);

  const vai = useGetToken({
    symbol: 'VAI',
  });
  const { data: getVaiUsdPriceData } = useGetTokenUsdPrice({
    token: vai,
  });
  const vaiPriceCents =
    getVaiUsdPriceData && convertDollarsToCents(getVaiUsdPriceData.tokenPriceUsd);

  const {
    data: getAccountPerformanceHistoryData,
    refetch: refetchAccountPerformanceHistoryData,
    error: getAccountPerformanceHistoryError,
  } = useGetAccountPerformanceHistory(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      period: selectedPeriod,
    },
    {
      enabled: !!accountAddress,
    },
  );
  const accountPerformanceHistory = getAccountPerformanceHistoryData?.performanceHistory || [];

  const { userDailyEarningsCents, userNetApyPercentage, userTotalVaultStakeCents } = useExtractData(
    {
      pool,
      vaults,
      xvsPriceCents,
      vaiPriceCents,
    },
  );

  const netWorthCents = pool
    ? new BigNumber(pool.userSupplyBalanceCents || 0)
        .plus(userTotalVaultStakeCents || 0)
        .minus(pool.userBorrowBalanceCents || 0)
        .minus(pool.vai?.userBorrowBalanceCents || 0)
        .toNumber()
    : undefined;

  const startOfDayNetWorthCents =
    getAccountPerformanceHistoryData?.startOfDayNetWorthCents !== undefined
      ? getAccountPerformanceHistoryData?.startOfDayNetWorthCents
      : undefined;

  const oldestNetWorthCents =
    accountPerformanceHistory.length > 0
      ? Number(accountPerformanceHistory[0].netWorthCents)
      : undefined;

  const absolutePerformanceCents =
    oldestNetWorthCents !== undefined && netWorthCents !== undefined
      ? netWorthCents - oldestNetWorthCents
      : undefined;

  const dailyChangeCents =
    startOfDayNetWorthCents !== undefined && netWorthCents !== undefined
      ? netWorthCents - startOfDayNetWorthCents
      : undefined;

  const dailyChangePercentage =
    dailyChangeCents !== undefined && netWorthCents !== undefined && netWorthCents !== 0
      ? (dailyChangeCents * 100) / netWorthCents
      : undefined;

  let readableDailyChangePercentage = formatPercentageToReadableValue(dailyChangePercentage);
  // Remove "-" sign
  if (readableDailyChangePercentage[0] === '-') {
    readableDailyChangePercentage = readableDailyChangePercentage.substring(1);
  }

  const graphCells: CellProps[] = [
    {
      label: t('dashboard.overview.todaysChange'),
      value: (
        <div className="space-x-2 flex items-start">
          <HidableUserBalance>
            <DollarValueChange value={dailyChangeCents} />

            {dailyChangeCents !== undefined && dailyChangeCents !== 0 && (
              <div
                className={cn(
                  'flex items-center',
                  dailyChangeCents > 0 ? 'text-green' : 'text-red',
                )}
              >
                <Icon
                  name="arrowUpFull2"
                  className={cn('w-4 h-4 text-inherit', dailyChangeCents < 0 && 'rotate-180')}
                />

                <span className="text-sm">{readableDailyChangePercentage}</span>
              </div>
            )}
          </HidableUserBalance>
        </div>
      ),
    },
    {
      label: t('dashboard.overview.absolutePerformance'),
      value: (
        <HidableUserBalance>
          <DollarValueChange value={absolutePerformanceCents} />
        </HidableUserBalance>
      ),
    },
  ];

  const summaryCells: CellProps[] = [
    {
      label: t('dashboard.overview.summary.cellGroup.netApy'),
      value: formatPercentageToReadableValue(userNetApyPercentage),
      tooltip: vaults
        ? t('dashboard.overview.summary.cellGroup.netApyWithVaultStakeTooltip')
        : t('dashboard.overview.summary.cellGroup.netApyTooltip'),
      className:
        typeof userNetApyPercentage === 'number' && userNetApyPercentage < 0
          ? 'text-red'
          : 'text-green',
    },
    {
      label: t('dashboard.overview.summary.cellGroup.dailyEarnings'),
      value: formatCentsToReadableValue({ value: userDailyEarningsCents }),
    },
    {
      label: t('dashboard.overview.summary.cellGroup.totalSupply'),
      value: formatCentsToReadableValue({ value: pool?.userSupplyBalanceCents }),
    },
    {
      label: t('dashboard.overview.summary.cellGroup.totalBorrow'),
      value: formatCentsToReadableValue({ value: pool?.userBorrowBalanceCents }),
    },
  ];

  if (userTotalVaultStakeCents) {
    summaryCells.push({
      label: t('dashboard.overview.summary.cellGroup.totalVaultStake'),
      value: formatCentsToReadableValue({ value: userTotalVaultStakeCents }),
    });
  }

  if (pool?.vai?.userBorrowBalanceCents) {
    summaryCells.push({
      label: t('dashboard.overview.summary.cellGroup.mintedVai'),
      value: formatCentsToReadableValue({ value: pool?.vai?.userBorrowBalanceCents }),
    });
  }

  const readableNetWorth = formatCentsToReadableValue({
    value: selectedDataPoint ? Number(selectedDataPoint.netWorthCents) : netWorthCents,
  });

  const shouldShowAccountBreakdown = !!accountAddress && !userChainSettings.doNotShowUserBalances;

  return (
    <div {...otherProps}>
      <div className="mb-3 space-y-3">
        {selectedDataPoint ? (
          <p className="text-sm">
            {t('dashboard.performanceChart.dataPoint.date', {
              date: new Date(selectedDataPoint.blockTimestampMs),
            })}
          </p>
        ) : (
          <div className="flex items-center gap-x-2">
            <p className="text-sm text-grey">{t('dashboard.overview.netWorth.label')}</p>

            <InfoIcon
              className="inline-flex"
              tooltip={
                isVaiFeatureEnabled
                  ? t('dashboard.overview.netWorth.tooltipWithVai')
                  : t('dashboard.overview.netWorth.tooltip')
              }
            />
          </div>
        )}

        <div className="flex items-center gap-x-2">
          <p className="text-3xl hidden md:block">
            <HidableUserBalance>{readableNetWorth}</HidableUserBalance>
          </p>

          <button type="button" onClick={toggleShowUserBalances} className="cursor-pointer p-1">
            <Icon
              name={userChainSettings.doNotShowUserBalances ? 'closedEye' : 'eye'}
              className="size-5"
            />
          </button>
        </div>
      </div>

      <button
        className={cn(
          'flex items-center w-full h-15 text-left justify-between gap-x-3',
          shouldShowAccountBreakdown && 'cursor-pointer',
        )}
        type="button"
        disabled={!accountAddress}
        onClick={toggleAccordion}
      >
        <CellGroup variant="secondary" cells={graphCells} />

        {shouldShowAccountBreakdown && (
          <div className="flex items-center gap-x-3" data-testid={testIds.performanceChartPreview}>
            {!isAccordionOpen && (
              <PerformanceChart
                accountPerformanceHistory={accountPerformanceHistory}
                className="hidden md:block w-49 h-15"
                displayAxes={false}
                displayToolTip={false}
                areaChartMargin={{
                  top: 0,
                }}
              />
            )}

            <Icon
              name="chevronDown"
              className={cn('size-3 text-white', isAccordionOpen && 'rotate-180')}
            />
          </div>
        )}
      </button>

      {shouldShowAccountBreakdown && (
        <AccordionAnimatedContent isOpen={isAccordionOpen} className="pt-6 flex flex-col gap-y-6">
          <ButtonGroup
            buttonLabels={periodOptions.map(p => p.label)}
            className="gap-x-1 inline-flex ml-auto"
            buttonClassName="h-8 font-normal"
            activeButtonIndex={periodOptions.findIndex(p => p.value === selectedPeriod)}
            onButtonClick={index => setSelectedPeriod(periodOptions[index].value)}
          />

          <PerformanceChart
            displayAxes
            onSelectedDataPointChange={setSelectedDataPoint}
            accountPerformanceHistory={accountPerformanceHistory}
            onRefetch={refetchAccountPerformanceHistoryData}
            error={getAccountPerformanceHistoryError ?? undefined}
            className="mb-6 shrink-0"
          />

          <div className="space-y-3">
            <p className="text-lg">{t('dashboard.overview.summary.title')}</p>

            <div className="grid grid-cols-2 gap-3 2xl:grid-cols-3">
              {summaryCells.map(cell => (
                <Cell {...cell} key={cell.label} />
              ))}
            </div>
          </div>
        </AccordionAnimatedContent>
      )}
    </div>
  );
};
