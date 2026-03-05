import { cn } from '@venusprotocol/ui';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import type { Token } from 'types';

import { InfoCard, useInfoCardDismissed } from './InfoCard';
import { PositionForm } from './PositionForm';

type FormTab = 'position' | 'collateral';

export interface RightPanelProps {
  longToken: Token;
  shortToken: Token;
  availableCollateralTokens: Token[];
  isWalletConnected: boolean;
  className?: string;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  longToken,
  shortToken,
  availableCollateralTokens,
  className,
}) => {
  const { t } = useTranslation();
  const { isDismissed: initialDismissed, dismiss: persistDismiss } = useInfoCardDismissed();
  const [isInfoCardDismissed, setIsInfoCardDismissed] = useState(initialDismissed);
  const [activeTab, setActiveTab] = useState<FormTab>('position');

  const handleDismiss = () => {
    persistDismiss();
    setIsInfoCardDismissed(true);
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {!isInfoCardDismissed && <InfoCard onDismiss={handleDismiss} />}

      {/* Card: tabs on top edge + form content */}
      <div className="rounded-xl bg-cards border border-lightGrey overflow-hidden">
        {/* Tabs row — sits on the card top, above content */}
        <div className="flex border-b border-lightGrey">
          {(['position', 'collateral'] as FormTab[]).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 py-3 text-b1s text-center transition-colors',
                activeTab === tab
                  ? 'text-white border-b-2 border-blue -mb-px'
                  : 'text-grey hover:text-white',
              )}
            >
              {tab === 'position'
                ? t('yieldPlus.positionForm.tabs.position')
                : t('yieldPlus.positionForm.tabs.collateral')}
            </button>
          ))}
        </div>

        {/* Form content */}
        <PositionForm
          longToken={longToken}
          shortToken={shortToken}
          availableCollateralTokens={availableCollateralTokens}
          className="p-4"
        />
      </div>
    </div>
  );
};
