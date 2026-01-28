import { VENUS_FLUX_URL } from 'constants/production';
import { useTranslation } from 'libs/translations';
import { Banner } from '../Banner';
import bgIllustrationSrc from './bgIllustration.jpg';
import venusFluxIconSrc from './venusFluxIcon.png';

export const VenusFluxBanner: React.FC = () => {
  const { t, Trans } = useTranslation();

  return (
    <Banner
      className="bg-black"
      title={<span className="text-offWhite">{t('venusFluxBanner.title')}</span>}
      description={
        <span className="text-grey">
          <Trans
            i18nKey="venusFluxBanner.description"
            components={{
              White: <span className="text-offWhite" />,
            }}
          />
        </span>
      }
      illustration={
        <div className="h-10 w-16 lg:h-14">
          <img
            src={venusFluxIconSrc}
            alt={t('venusFluxBanner.iconAltText')}
            className="absolute size-16 -mt-5.5 sm:-mt-3"
          />
        </div>
      }
      backgroundIllustration={
        <div className="absolute inset-0">
          <img
            src={bgIllustrationSrc}
            alt={t('venusFluxBanner.bgIllustrationAltText')}
            className="w-full h-full object-cover"
          />
        </div>
      }
      contentContainerClassName="sm:gap-x-3"
      learnMoreUrl={VENUS_FLUX_URL}
      learnMoreLabel={t('adBanner.startNow')}
    />
  );
};
