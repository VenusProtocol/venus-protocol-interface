import { Carousel, CarouselItem, Icon } from 'components';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { BoostBanner } from './BoostBanner';
import { IsolatedPoolsSunsetBanner } from './IsolatedPoolsSunsetBanner';
import { ProbableBanner } from './ProbableBanner';
import { VenusFluxBanner } from './VenusFluxBanner';
import { store } from './store';

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

  const doNotShowAdCarousel = store.use.doNotShowAdCarousel();
  const hideAdCarousel = store.use.hideAdCarousel();

  if (doNotShowAdCarousel || slides.length === 0) {
    return undefined;
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

      <button
        className="absolute p-4 top-0 right-0 cursor-pointer @min-[357px]:right-2 @min-[357px]:top-2 @min-[576px]:top-3"
        type="button"
        onClick={hideAdCarousel}
      >
        <Icon name="closeRounded" className="text-light-grey size-3" />
      </button>
    </div>
  );
};
