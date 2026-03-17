import { Carousel, CarouselItem } from 'components';
import { BinanceWalletBanner } from './BinanceWalletBanner';
import { BoostBanner } from './BoostBanner';
import { IsolatedPoolsSunsetBanner } from './IsolatedPoolsSunsetBanner';
import { ProbableBanner } from './ProbableBanner';
import { VenusFluxBanner } from './VenusFluxBanner';

export const AdBanner: React.FC = () => {
  const slides: React.ReactNode[] = [
    <VenusFluxBanner />,
    <BoostBanner />,
    <BinanceWalletBanner />,
    <IsolatedPoolsSunsetBanner />,
    <ProbableBanner />,
  ];

  return (
    <Carousel autoPlay className="pt-4 -mt-4">
      {slides.map((slide, i) => (
        <CarouselItem key={i}>{slide}</CarouselItem>
      ))}
    </Carousel>
  );
};
