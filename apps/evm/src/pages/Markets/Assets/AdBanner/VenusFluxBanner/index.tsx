import { ButtonWrapper } from '@venusprotocol/ui';
import { VENUS_FLUX_URL } from 'constants/production';
import { Link } from 'containers/Link';
import { useBreakpointUp } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import mobileIllustrationSrc from './mobileIllustration.png';
import tabletIllustrationSrc from './tabletIllustration.png';

export const VenusFluxBanner: React.FC = () => {
  const { t } = useTranslation();
  const isSmOrUp = useBreakpointUp('sm');

  return (
    <div className="relative rounded-lg h-26.25 px-4 pt-2 pb-3 flex flex-col gap-y-3 bg-linear-to-r from-[#363636] to-[#0C0C0C] sm:h-18 sm:flex-row sm:items-center sm:justify-between sm:py-3 sm:pl-31">
      <img
        src={mobileIllustrationSrc}
        className="absolute left-4 bottom-0 h-12 sm:hidden"
        alt={t('venusFluxBanner.illustrationAltText')}
      />

      <img
        src={tabletIllustrationSrc}
        className="hidden absolute bottom-0 left-3 h-19 sm:block"
        alt={t('venusFluxBanner.illustrationAltText')}
      />

      <div className="space-y-0.5">
        <p className="font-semibold text-sm lg:text-base">{t('venusFluxBanner.title')}</p>
        <p className="text-xs text-grey lg:text-sm">{t('venusFluxBanner.description')}</p>
      </div>

      <ButtonWrapper size={isSmOrUp ? 'md' : 'xs'} className="self-end" asChild>
        <Link href={VENUS_FLUX_URL} target="_blank" noStyle>
          {t('adBanner.startNow')}
        </Link>
      </ButtonWrapper>
    </div>
  );
};
