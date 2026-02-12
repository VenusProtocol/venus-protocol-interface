import { VENUS_FLUX_URL } from 'constants/production';
import { useTranslation } from 'libs/translations';
import { Banner } from '../Banner';
import backgroundIllustrationJpg from './background.jpg';
import venusFluxIconSrc from './venusFluxIcon.png';

export const VenusFluxBanner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Banner
      title={t('adCarousel.venusFluxBanner.title')}
      description={t('adCarousel.venusFluxBanner.description')}
      buttonLabel={t('adCarousel.venusFluxBanner.buttonLabel')}
      className="bg-black"
      href={VENUS_FLUX_URL}
    >
      <img
        className="absolute max-w-none left-[50%] -top-17 translate-x-[-50%] size-160 object-contain @min-[576px]:w-[110%] @min-[576px]:h-auto @min-[576px]:top-[160%] @min-[576px]:translate-y-[-50%]"
        src={backgroundIllustrationJpg}
        alt={t('adCarousel.venusFluxBanner.backgroundIllustration.altText')}
      />

      <img
        className="absolute max-w-none size-31 bottom-6 right-8 @min-[357px]:size-42 @min-[409px]:bottom-12 @min-[576px]:bottom-7 @min-[576px]:size-32 @min-[576px]:right-12 @min-[1120px]:size-39 @min-[1120px]:bottom-6"
        src={venusFluxIconSrc}
        alt={t('adCarousel.venusFluxBanner.venusFluxIcon.altText')}
      />
    </Banner>
  );
};
