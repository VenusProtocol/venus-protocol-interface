import { useMemo, useState } from 'react';

import { ButtonGroup, Spinner } from 'components';
import { useTranslation } from 'libs/translations';

import type { MarketHistoryPeriodType } from 'clients/api';

import { useGetMarketChartData } from 'hooks/useGetMarketChartData';
import type { PendleVault } from 'types';
import { SupplyChart } from './SupplyChart';

export const TotalDeposits: React.FC<{ vault: PendleVault }> = ({ vault }) => {
  const { t } = useTranslation();

  const [selectedPeriod, setSelectedPeriod] = useState<MarketHistoryPeriodType>('month');

  const periodOptions: { label: string; value: MarketHistoryPeriodType }[] = useMemo(
    () => [
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
    ],
    [t],
  );

  const {
    data: { supplyChartData },
    isLoading,
  } = useGetMarketChartData({
    vToken: vault.asset.vToken,
    period: selectedPeriod,
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-p2s text-white pb-2">{t('vault.modals.overview.totalDeposited')}</p>

        <ButtonGroup
          buttonSize="xs"
          buttonLabels={periodOptions.map(p => p.label)}
          activeButtonIndex={periodOptions.findIndex(p => p.value === selectedPeriod)}
          onButtonClick={index => setSelectedPeriod(periodOptions[index].value)}
          buttonClassName="min-w-fit"
        />
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="size-2 rounded-full bg-green" />
          <span className="text-b1r text-grey">{t('vault.modals.overview.totalDeposited')}</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center w-full min-h-62">
            <Spinner />
          </div>
        ) : (
          <SupplyChart data={supplyChartData} selectedPeriod={selectedPeriod} />
        )}
      </div>
    </div>
  );
};
