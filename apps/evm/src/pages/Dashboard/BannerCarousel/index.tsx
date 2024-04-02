import { Carousel, CarouselItem } from 'components';

import { PrimePromotionalBanner } from './PrimePromotionalBanner';

export const BannerCarousel: React.FC = () => (
  <Carousel className="h-[220px] mb-6">
    <CarouselItem>
      <PrimePromotionalBanner />
    </CarouselItem>

    <CarouselItem>
      <>Test banner</>
    </CarouselItem>
  </Carousel>
);
