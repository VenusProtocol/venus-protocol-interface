import { ButtonGroup } from 'components';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import { LiquidationsDailyChart } from './LiquidationsDailyChart';
import { LiquidationsDistributionChart } from './LiquidationsDistributionChart';
import { LiquidationsKpis } from './LiquidationsKpis';

// t('statsPage.liquidations.period.24h')
// t('statsPage.liquidations.period.7d')
// t('statsPage.liquidations.period.30d')
const PERIOD_OPTIONS = [
  { days: 1, labelKey: 'statsPage.liquidations.period.24h' },
  { days: 7, labelKey: 'statsPage.liquidations.period.7d' },
  { days: 30, labelKey: 'statsPage.liquidations.period.30d' },
] as const;
const DEFAULT_PERIOD_INDEX = PERIOD_OPTIONS.length - 1;

export const Liquidations: React.FC = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(DEFAULT_PERIOD_INDEX);
  const days = PERIOD_OPTIONS[activeIndex].days;

  return (
    <div className="flex flex-col gap-6 pb-12">
      <ButtonGroup
        variant="secondary"
        buttonLabels={PERIOD_OPTIONS.map(option => t(option.labelKey))}
        activeButtonIndex={activeIndex}
        onButtonClick={setActiveIndex}
      />
      <LiquidationsKpis days={days} />
      <LiquidationsDailyChart days={days} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LiquidationsDistributionChart days={days} by="collateral" />
        <LiquidationsDistributionChart days={days} by="debt" />
      </div>
    </div>
  );
};
