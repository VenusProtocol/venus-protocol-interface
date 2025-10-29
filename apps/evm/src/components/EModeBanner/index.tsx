import { cn } from '@venusprotocol/ui';
import type { Address } from 'viem';

import { IsolatedEModeGroupTooltip } from 'components';
import { EModeIcon } from 'components/EModeIcon';
import { Icon } from 'components/Icon';
import { E_MODE_DOC_URL } from 'constants/production';
import { Link } from 'containers/Link';
import { useBreakpointUp } from 'hooks/responsive';
import { useAnalytics } from 'libs/analytics';
import { useTranslation } from 'libs/translations';
import type { EModeGroup } from 'types';
import { EModeButton } from './EModeButton';
import illustrationSrc from './illustration.svg';

export interface EModeBannerProps {
  poolComptrollerContractAddress: Address;
  analyticVariant: string;
  variant?: 'primary' | 'secondary';
  enabledEModeGroup?: EModeGroup;
  className?: string;
}

export const EModeBanner: React.FC<EModeBannerProps> = ({
  enabledEModeGroup,
  variant = 'primary',
  poolComptrollerContractAddress,
  analyticVariant,
  className,
}) => {
  const { t, Trans } = useTranslation();
  const isMdOrUp = useBreakpointUp('md');
  const { captureAnalyticEvent } = useAnalytics();

  const handleLearnMoreClick = () =>
    captureAnalyticEvent('e_mode_learn_more_click', {
      variant: 'assets_tab',
    });

  return (
    <div
      className={cn(
        'rounded-lg bg-gradient-to-l from-[#071F39] to-[#1549A1] relative flex items-center before:content-[""] before:absolute before:inset-0 before:bg-[url("/images/noise.png")] before:bg-repeat before:mix-blend-soft-light overflow-hidden sm:pr-3',
        enabledEModeGroup ? 'pl-4 pr-2 lg:pr-2' : 'px-4 lg:pr-3',
        variant === 'primary' ? 'py-2 lg:pl-6' : 'h-14',
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
              analyticVariant={analyticVariant}
            >
              {t('eModeBanner.manageEModeButtonLabel')}
            </EModeButton>
          </div>
        ) : (
          <>
            {variant === 'primary' && (
              <div className="flex items-center justify-between mb-2 sm:hidden">
                <img
                  src={illustrationSrc}
                  alt={t('eModeBanner.illustrationAltText')}
                  className="h-10"
                />

                <EModeButton
                  small
                  poolComptrollerContractAddress={poolComptrollerContractAddress}
                  analyticVariant={analyticVariant}
                >
                  {t('eModeBanner.exploreButtonLabel')}
                </EModeButton>
              </div>
            )}

            <div className="flex items-center gap-x-4">
              <img
                src={illustrationSrc}
                alt={t('eModeBanner.illustrationAltText')}
                className={cn(variant === 'primary' ? 'h-12 lg:h-14 hidden sm:block' : 'h-10')}
              />

              <div className="space-y-[2px]">
                <h2
                  className={cn('font-semibold text-sm', variant === 'primary' && 'lg:text-base')}
                >
                  {t('eModeBanner.title')}
                </h2>

                {variant === 'primary' && (
                  <p className="text-grey text-xs lg:text-sm">
                    <Trans
                      i18nKey="eModeBanner.description"
                      components={{
                        Link: (
                          <Link
                            href={E_MODE_DOC_URL}
                            onClick={handleLearnMoreClick}
                            className="underline"
                            target="_blank"
                          />
                        ),
                      }}
                    />
                  </p>
                )}
              </div>

              <EModeButton
                poolComptrollerContractAddress={poolComptrollerContractAddress}
                analyticVariant={analyticVariant}
                small={variant === 'secondary'}
                className={cn(
                  'ml-auto',
                  variant === 'primary' || isMdOrUp ? 'hidden sm:flex' : 'h-8 w-8 p-0 shrink-0',
                )}
              >
                {variant === 'primary' || isMdOrUp ? (
                  t('eModeBanner.exploreButtonLabel')
                ) : (
                  <Icon name="chevronRight" className="text-offWhite w-6 h-6" />
                )}
              </EModeButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
