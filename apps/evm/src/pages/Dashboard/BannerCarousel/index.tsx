import { Carousel, CarouselItem } from 'components';

import { LidoBanner } from './LidoBanner';
import { PrimePromotionalBanner } from './PrimePromotionalBanner';

export const BannerCarousel: React.FC = () => (
  <Carousel className="mb-6">
    <CarouselItem>
      <LidoBanner />
    </CarouselItem>

    <CarouselItem>
      <PrimePromotionalBanner />
    </CarouselItem>

    <CarouselItem>
      <LidoBanner />
    </CarouselItem>

    <CarouselItem>
      <PrimePromotionalBanner />
    </CarouselItem>
  </Carousel>
);
