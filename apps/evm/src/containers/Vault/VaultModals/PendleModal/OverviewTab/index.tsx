import { useState } from 'react';

import { AccordionAnimatedContent, Icon } from 'components';
import { useTranslation } from 'libs/translations';
import type { AnyVault } from 'types';

import { MarketInfo } from './MarketInfo';
import { StrategyDiagram } from './StrategyDiagram';
import { TotalDeposits } from './TotalDeposits';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-p2s text-white">{title}</p>

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

      <AccordionAnimatedContent isOpen={isOpen}>
        <div className="mt-4">{children}</div>
      </AccordionAnimatedContent>
    </div>
  );
};

export interface OverviewTabProps {
  vault: AnyVault;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ vault }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8 py-4">
      <TotalDeposits vault={vault} />

      <CollapsibleSection title={t('pendleModal.overview.strategyAllocation')}>
        <StrategyDiagram vault={vault} />
      </CollapsibleSection>

      <CollapsibleSection title={t('pendleModal.overview.marketInfo')}>
        <MarketInfo vault={vault} />
      </CollapsibleSection>
    </div>
  );
};
