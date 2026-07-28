import { Carousel, CarouselItem } from 'components';
import { BoostBanner } from './BoostBanner';
import { IsolatedPoolsSunsetBanner } from './IsolatedPoolsSunsetBanner';
import { PendleVaultBanner } from './PendleVaultBanner';
import { TradeBanner } from './TradeBanner';

export const AdBanner: React.FC = () => {
  const slides: React.ReactNode[] = [
    <TradeBanner />,
    <PendleVaultBanner />,
    <BoostBanner />,
    <IsolatedPoolsSunsetBanner />,
  ];

  return (
    <Carousel autoPlay className="pt-4 -mt-4">
      {slides.map((slide, i) => (
        <CarouselItem key={i}>{slide}</CarouselItem>
      ))}
    </Carousel>
  );
};
