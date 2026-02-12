import { useTranslation } from 'libs/translations';
import { Banner } from '../Banner';
import backgroundIllustrationJpg from './background.jpg';
import coinIllustrationSrc from './coin.png';

const LEARN_MORE_URL = 'https://probable.markets';

export const ProbableBanner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Banner
      title={t('adCarousel.probableBanner.title')}
      description={t('adCarousel.probableBanner.description')}
      buttonLabel={t('adCarousel.probableBanner.buttonLabel')}
      className="bg-black"
      href={LEARN_MORE_URL}
    >
      <img
        className="absolute max-w-none left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] size-full object-cover"
        src={backgroundIllustrationJpg}
        alt={t('adCarousel.probableBanner.backgroundIllustration.altText')}
      />

      <img
        className="absolute max-w-none w-55 bottom-0 -right-6 @min-[357px]:w-80 @min-[357px]:-right-11 @min-[576px]:w-57 @min-[576px]:right-2 @min-[896px]:right-30 @min-[1120px]:w-66 @min-[1120px]:right-10"
        src={coinIllustrationSrc}
        alt={t('adCarousel.probableBanner.coinIllustration.altText')}
      />
    </Banner>
  );
};
