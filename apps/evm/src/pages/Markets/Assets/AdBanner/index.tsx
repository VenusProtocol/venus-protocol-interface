import { Carousel, CarouselItem } from 'components';
import { BinanceWalletBanner } from './BinanceWalletBanner';
import { BoostBanner } from './BoostBanner';
import { IsolatedPoolsSunsetBanner } from './IsolatedPoolsSunsetBanner';
import { ProbableBanner } from './ProbableBanner';

export const AdBanner: React.FC = () => {
  const slides: React.ReactNode[] = [
    <BoostBanner />,
    <BinanceWalletBanner />,
    <IsolatedPoolsSunsetBanner />,
    <ProbableBanner />,
  ];

  const carouselDom =
    slides.length > 1 ? (
      <Carousel autoPlay className="pt-4 -mt-4">
        {slides.map((slide, i) => (
          <CarouselItem key={i}>{slide}</CarouselItem>
        ))}
      </Carousel>
    ) : (
      slides
    );

  return <div className="lg:mt-4">{carouselDom}</div>;
};
