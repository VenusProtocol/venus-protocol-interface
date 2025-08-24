import { cn } from '@venusprotocol/ui';
import type { Address } from 'viem';

import { Icon } from 'components/Icon';
import { E_MODE_DOC_URL } from 'constants/production';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import { EModeButton } from './EModeButton';
import illustrationSrc from './illustration.svg';

export interface EModeBannerProps {
  poolComptrollerContractAddress: Address;
  enabledEModeGroup?: {
    name: string;
    description: string;
  };
  className?: string;
}

export const EModeBanner: React.FC<EModeBannerProps> = ({
  enabledEModeGroup,
  poolComptrollerContractAddress,
  className,
}) => {
  const { t, Trans } = useTranslation();

  return (
    <div
      className={cn(
        'py-2 rounded-lg bg-gradient-to-l from-[#071F39] to-[#1549A1] relative before:content-[""] before:absolute before:inset-0 before:bg-[url("/images/noise.png")] before:bg-repeat before:mix-blend-soft-light overflow-hidden sm:pr-3 lg:pl-6 ',
        enabledEModeGroup ? 'pl-4 pr-2 lg:py-2 lg:pr-2' : 'px-4 lg:py-3 lg:pr-3',
        className,
      )}
    >
      <div className="relative">
        {enabledEModeGroup ? (
          <div className="flex items-center gap-x-4 justify-between">
            <div className="flex items-center gap-x-2">
              <div className="w-5 h-5 flex items-center justify-center rounded-full bg-gradient-to-r from-[#00F5A0] to-[#00D9F5]">
                <Icon name="lightning2" className="text-cards h-3" />
              </div>

              <p className="font-semibold text-sm">{enabledEModeGroup.name}</p>

              <p className="text-grey text-sm hidden sm:block">{enabledEModeGroup.description}</p>
            </div>

            <EModeButton small poolComptrollerContractAddress={poolComptrollerContractAddress}>
              {t('eModeBanner.manageEModeButtonLabel')}
            </EModeButton>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2 sm:hidden">
              <img
                src={illustrationSrc}
                alt={t('eModeBanner.illustrationAltText')}
                className="h-10"
              />

              <EModeButton small poolComptrollerContractAddress={poolComptrollerContractAddress}>
                {t('eModeBanner.exploreButtonLabel')}
              </EModeButton>
            </div>

            <div className="flex items-center gap-x-4">
              <img
                src={illustrationSrc}
                alt={t('eModeBanner.illustrationAltText')}
                className="hidden h-12 sm:block lg:h-14"
              />

              <div className="space-y-[2px]">
                <h2 className="font-semibold">{t('eModeBanner.title')}</h2>

                <p className="text-grey">
                  <Trans
                    i18nKey="eModeBanner.description"
                    components={{
                      Link: <Link href={E_MODE_DOC_URL} className="underline" target="_blank" />,
                    }}
                  />
                </p>
              </div>

              <EModeButton
                poolComptrollerContractAddress={poolComptrollerContractAddress}
                className="ml-auto hidden sm:flex"
              >
                {t('eModeBanner.exploreButtonLabel')}
              </EModeButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
