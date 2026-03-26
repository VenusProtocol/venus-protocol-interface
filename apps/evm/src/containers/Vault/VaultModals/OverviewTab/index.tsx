import { useTranslation } from 'libs/translations';
import type { AnyVault } from 'types';

import { CollapsibleSection } from './CollapsibleSection';
import { MarketInfo } from './MarketInfo';
import { StrategyDiagram } from './StrategyDiagram';
import { TotalDeposits } from './TotalDeposits';

export interface OverviewTabProps {
  vault: AnyVault;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ vault }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8 py-2">
      <TotalDeposits vault={vault} />

      <CollapsibleSection title={t('vault.modals.overview.strategyAllocation')}>
        <StrategyDiagram vault={vault} />
      </CollapsibleSection>

      <CollapsibleSection title={t('vault.modals.overview.marketInfo')}>
        <MarketInfo vault={vault} />
      </CollapsibleSection>
    </div>
  );
};
