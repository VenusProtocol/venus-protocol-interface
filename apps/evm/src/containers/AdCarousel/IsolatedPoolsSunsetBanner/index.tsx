import { VENUS_COMMUNITY_URL } from 'constants/production';
import { useTranslation } from 'libs/translations';
import { Banner } from '../Banner';
import backgroundIllustrationJpg from './background.jpg';
import coinsIllustrationSrc from './coins.png';

const LEARN_MORE_URL = `${VENUS_COMMUNITY_URL}/t/isolated-pools-sunset/5603`;

export const IsolatedPoolsSunsetBanner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Banner
      title={t('adCarousel.isolatedPoolsSunsetBanner.title')}
      description={t('adCarousel.isolatedPoolsSunsetBanner.description')}
      buttonLabel={t('adCarousel.isolatedPoolsSunsetBanner.buttonLabel')}
      href={LEARN_MORE_URL}
    >
      <img
        className="absolute max-w-none size-130 top-0 left-[50%] translate-x-[-50%] @min-[357px]:size-180 @min-[357px]:-top-20 @min-[576px]:top-[50%] @min-[576px]:translate-y-[-30%] @min-[576px]:size-[200%]"
        src={backgroundIllustrationJpg}
        alt={t('adCarousel.isolatedPoolsSunsetBanner.backgroundIllustration.altText')}
      />

      <img
        className="absolute max-w-none size-62 -bottom-18 -right-10 @min-[357px]:size-97 @min-[357px]:-bottom-20 @min-[357px]:-right-16 @min-[576px]:size-80 @min-[576px]:-bottom-20 @min-[576px]:right-auto @min-[576px]:left-75 @min-[686px]:size-88 @min-[686px]:left-auto @min-[686px]:right-5 @min-[896px]:size-116 @min-[896px]:-bottom-33"
        src={coinsIllustrationSrc}
        alt={t('adCarousel.isolatedPoolsSunsetBanner.coinsIllustration.altText')}
      />
    </Banner>
  );
};
