import { Carousel, CarouselItem, Icon } from 'components';
import { PrimeBanner } from './PrimeBanner';

const slides: React.ReactNode[] = [<PrimeBanner />];

export const AdCarousel: React.FC = () => {
  const closeCarousel = () => {}; // TODO: wire up

  const slidesDom =
    slides.length > 1 ? (
      <Carousel autoPlay className="px-4 -mx-4">
        {slides.map((slide, i) => (
          <CarouselItem key={i}>{slide}</CarouselItem>
        ))}
      </Carousel>
    ) : (
      slides
    );

  return (
    <div className="relative">
      {slidesDom}

      <button
        className="absolute p-4 top-0 right-0 sm:right-2 xl:hidden"
        type="button"
        onClick={closeCarousel}
      >
        <Icon name="closeRounded" className="text-light-grey size-3" />
      </button>
    </div>
  );
};
