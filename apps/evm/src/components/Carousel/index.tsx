import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import { forwardRef, useEffect, useState } from 'react';
import { cn } from 'utilities';

export type CarouselApi = UseEmblaCarouselType[1];
export type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
export type CarouselOptions = UseCarouselParameters[0];
export type CarouselPlugin = UseCarouselParameters[1];

export type CarouselProps = {
  autoPlay?: boolean;
  autoPlayDelayMs?: number;
  setApi?: (api: CarouselApi) => void;
};

export * from './CarouselItem';

const AUTOPLAY_DELAY_MS = 9000;

export const Carousel = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(({ autoPlay = false, setApi, className, children, ...props }, ref) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const slidesCount =
    children !== null && typeof children === 'object' && Symbol.iterator in children
      ? [...children].length
      : 0;

  const [carouselRef, api] = useEmblaCarousel(
    {
      axis: 'x',
      active: slidesCount > 1,
    },
    autoPlay ? [Autoplay({ delay: AUTOPLAY_DELAY_MS })] : undefined,
  );

  useEffect(() => {
    if (!api || !setApi) {
      return;
    }

    setApi(api);
  }, [api, setApi]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setActiveSlideIndex(api.selectedScrollSnap());

    api.on('select', () => {
      setActiveSlideIndex(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div
      ref={ref}
      className={cn('relative select-none', className)}
      role="region"
      aria-roledescription="carousel"
      {...props}
    >
      <div ref={carouselRef} className="overflow-hidden">
        <div className="flex -ml-4">{children}</div>
      </div>

      {slidesCount > 1 && (
        <div className="flex mx-auto gap-3 w-max mt-4">
          {Array.from({ length: slidesCount }).map((_s, i) => (
            <button
              type="button"
              onClick={() => api?.scrollTo(i)}
              key={i}
              className={cn(
                'w-2 h-2 rounded-full bg-offWhite',
                i !== activeSlideIndex && 'bg-opacity-30',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
});
