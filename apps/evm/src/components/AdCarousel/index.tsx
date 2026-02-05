import { Carousel, CarouselItem } from 'components';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { BoostBanner } from './BoostBanner';
import { IsolatedPoolsSunsetBanner } from './IsolatedPoolsSunsetBanner';
import { ProbableBanner } from './ProbableBanner';
import { VenusFluxBanner } from './VenusFluxBanner';

export const AdCarousel: React.FC = () => {
  const isPrimeCalculatorFeatureEnabled = useIsFeatureEnabled({ name: 'primeCalculator' });

  const slides: React.ReactNode[] = [];

  if (isPrimeCalculatorFeatureEnabled) {
    slides.push(
      <BoostBanner />,
      <VenusFluxBanner />,
      <ProbableBanner />,
      <IsolatedPoolsSunsetBanner />,
    );
  }

  return (
    <div className="relative @container/carousel">
      <Carousel
        autoPlay
        className="rounded-2xl overflow-hidden"
        trackerClassName="absolute bottom-4 left-4 @min-[357px]:left-6 @min-[357px]:bottom-6 @min-[409px]:bottom-12 @min-[576px]:left-auto @min-[576px]:right-8 @min-[576px]:bottom-7 @min-[1120px]:right-auto @min-[1120px]:left-6 @min-[1120px]:bottom-4"
      >
        {slides.map((slide, i) => (
          <CarouselItem key={i}>{slide}</CarouselItem>
        ))}
      </Carousel>
    </div>
  );
};
