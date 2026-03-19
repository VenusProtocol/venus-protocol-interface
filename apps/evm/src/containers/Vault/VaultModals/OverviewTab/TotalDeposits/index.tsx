import { useMemo, useState } from 'react';

import { AccordionAnimatedContent, ButtonGroup, Icon } from 'components';
import { useTranslation } from 'libs/translations';

import type { MarketHistoryPeriodType } from 'clients/api';

import { useGetMarketChartData } from 'hooks/useGetMarketChartData';
import type { AnyVault, PendleVault } from 'types';
import { SupplyChart } from './SupplyChart';

export const TotalDeposits: React.FC<{ vault: AnyVault }> = ({ vault }) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(true);

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
  } = useGetMarketChartData({
    vToken: (vault as PendleVault).vToken,
    period: selectedPeriod,
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-p2s text-white">{t('vaultModals.overview.totalDeposits')}</p>

        <div className="flex items-center gap-3">
          <ButtonGroup
            buttonSize="xs"
            buttonLabels={periodOptions.map(p => p.label)}
            activeButtonIndex={periodOptions.findIndex(p => p.value === selectedPeriod)}
            onButtonClick={index => setSelectedPeriod(periodOptions[index].value)}
            buttonClassName="min-w-fit"
          />

          <button
            type="button"
            className="hidden md:block text-grey hover:text-white transition-colors"
            onClick={() => setIsOpen(prev => !prev)}
          >
            <Icon
              name="chevronDown"
              className={`size-4 transition-transform cursor-pointer ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      <AccordionAnimatedContent isOpen={isOpen}>
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="size-2 rounded-full bg-green" />
            <span className="text-b1r text-grey">{t('vaultModals.overview.totalStaked')}</span>
          </div>

          <SupplyChart data={supplyChartData} selectedPeriod={selectedPeriod} />
        </div>
      </AccordionAnimatedContent>
    </div>
  );
};
