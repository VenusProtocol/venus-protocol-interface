import { ButtonWrapper } from '@venusprotocol/ui';

import { Link } from 'containers/Link';
import { useBreakpointUp } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import illustrationSrc from './illustration.png';

const CAMPAIGN_URL = 'https://binance.onelink.me/mL1z/x0rd7v8u?af_force_deeplink=true';

export const VenusFluxBanner: React.FC = () => {
  const { t, Trans } = useTranslation();
  const isSmOrUp = useBreakpointUp('sm');

  return (
    <div className="relative rounded-lg h-26.25 px-4 pt-2 pb-3 flex flex-col gap-y-3 bg-linear-to-r from-[#363636] to-[#0C0C0C] sm:h-18 sm:flex-row sm:items-center sm:justify-between sm:py-3 sm:pl-29">
      <div className="flex flex-col gap-y-3 sm:flex-row sm:justify-between sm:gap-x-4 sm:items-center sm:grow">
        <div className="flex flex-col gap-y-0.5">
          <p className="font-semibold text-sm sm:text-base">{t('venusFluxBanner.title')}</p>

          <p className="text-xs text-grey sm:text-sm">
            <Trans
              i18nKey="venusFluxBanner.description"
              components={{
                YellowText: <span className="text-yellow" />,
              }}
            />
          </p>
        </div>

        <ButtonWrapper size={isSmOrUp ? 'md' : 'xs'} className="px-5 self-start md:px-6" asChild>
          <Link href={CAMPAIGN_URL} noStyle>
            {t('adBanner.startNow')}
          </Link>
        </ButtonWrapper>
      </div>

      <img
        src={illustrationSrc}
        className="absolute right-2 bottom-1 h-19 sm:left-4 sm:right-auto sm:bottom-0 sm:h-22"
        alt={t('venusFluxBanner.illustrationAltText')}
      />
    </div>
  );
};
