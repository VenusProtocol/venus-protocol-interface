import { VENUS_DOC_URL } from 'constants/production';
import { useTranslation } from 'libs/translations';
import { Banner } from '../Banner';
import rocketIllustrationSrc from './rocket.png';

const LEARN_MORE_URL = `${VENUS_DOC_URL}/guides/leveraged-positions`;

export const BoostBanner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Banner
      title={t('adCarousel.boostBanner.title')}
      description={t('adCarousel.boostBanner.description')}
      buttonLabel={t('adCarousel.boostBanner.buttonLabel')}
      className="bg-[linear-gradient(142deg,#00193A_20%,#0E3FB7_75%,#001E68_95%)]"
      href={LEARN_MORE_URL}
    >
      <img
        className="absolute size-112 max-w-none -bottom-45 -right-35 @min-[357px]:size-125 @min-[357px]:-bottom-33 @min-[357px]:right-auto @min-[357px]:-left-10 @min-[409px]:left-5 @min-[409px]:-bottom-44 @min-[576px]:h-119 @min-[576px]:-bottom-57 @min-[576px]:left-auto @min-[576px]:-right-12 @min-[896px]:size-160 @min-[896px]:rotate-12 @min-[896px]:-bottom-79 @min-[896px]:left-44 @min-[1120px]:size-194 @min-[1120px]:rotate-16 @min-[1120px]:-bottom-94 @min-[1120px]:left-80"
        src={rocketIllustrationSrc}
        alt={t('adCarousel.boostBanner.rocketIllustration.altText')}
      />
    </Banner>
  );
};
