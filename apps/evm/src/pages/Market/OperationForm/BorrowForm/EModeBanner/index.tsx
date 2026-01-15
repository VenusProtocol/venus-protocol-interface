import { cn } from '@venusprotocol/ui';
import type { Address } from 'viem';

import { IsolatedEModeGroupTooltip } from 'components';
import { EModeIcon } from 'components/EModeIcon';
import { Icon } from 'components/Icon';
import { useBreakpointUp } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import type { EModeGroup } from 'types';
import { EModeButton } from './EModeButton';
import illustrationSrc from './illustration.svg';

export interface EModeBannerProps {
  poolComptrollerContractAddress: Address;
  enabledEModeGroup?: EModeGroup;
  className?: string;
}

export const EModeBanner: React.FC<EModeBannerProps> = ({
  enabledEModeGroup,
  poolComptrollerContractAddress,
  className,
}) => {
  const { t } = useTranslation();
  const isMdOrUp = useBreakpointUp('md');

  return (
    <div
      className={cn(
        'rounded-lg bg-linear-to-l h-14 from-[#071F39] to-[#1549A1] relative flex items-center before:content-[""] before:absolute before:inset-0 before:bg-[url("/images/noise.png")] before:bg-repeat before:mix-blend-soft-light overflow-hidden sm:pr-3',
        enabledEModeGroup ? 'pl-4 pr-2 lg:pr-2' : 'px-4 lg:pr-3',
        className,
      )}
    >
      <div className="relative flex-1">
        {enabledEModeGroup ? (
          <div className="flex items-center gap-x-4 justify-between">
            <div className="flex items-center gap-x-2">
              <EModeIcon />

              <p className="font-semibold text-sm">{enabledEModeGroup.name}</p>

              {enabledEModeGroup.isIsolated && (
                <IsolatedEModeGroupTooltip
                  eModeGroupName={enabledEModeGroup.name}
                  variant="secondary"
                />
              )}
            </div>

            <EModeButton
              small
              poolComptrollerContractAddress={poolComptrollerContractAddress}
              analyticVariant="market_borrow_banner"
            >
              {t('eModeBanner.manageEModeButtonLabel')}
            </EModeButton>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-x-4">
              <img
                src={illustrationSrc}
                alt={t('eModeBanner.illustrationAltText')}
                className="h-10"
              />

              <div className="space-y-[2px]">
                <h2 className="font-semibold text-sm">{t('eModeBanner.title')}</h2>
              </div>

              <EModeButton
                poolComptrollerContractAddress={poolComptrollerContractAddress}
                analyticVariant="market_borrow_banner"
                small
                className={cn('ml-auto', isMdOrUp ? 'hidden sm:flex' : 'h-8 w-8 p-0 shrink-0')}
              >
                {isMdOrUp ? (
                  t('eModeBanner.exploreButtonLabel')
                ) : (
                  <Icon name="chevronRight" className="text-white w-6 h-6" />
                )}
              </EModeButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
