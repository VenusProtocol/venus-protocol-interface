import { cn } from '@venusprotocol/ui';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import { forwardRef, useEffect, useState } from 'react';

export type CarouselApi = UseEmblaCarouselType[1];
export type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
export type CarouselOptions = UseCarouselParameters[0];
export type CarouselPlugin = UseCarouselParameters[1];

export type CarouselProps = {
  autoPlay?: boolean;
  autoPlayDelayMs?: number;
  setApi?: (api: CarouselApi) => void;
  trackerClassName?: string;
};

export * from './CarouselItem';

const AUTOPLAY_DELAY_MS = 9000;

export const Carousel = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(({ autoPlay = false, setApi, className, children, trackerClassName, ...props }, ref) => {
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
      className={cn('relative select-none overflow-hidden', className)}
      role="region"
      aria-roledescription="carousel"
      {...props}
    >
      <div ref={carouselRef}>
        <div className="flex -ml-4">{children}</div>
      </div>

      {slidesCount > 1 && (
        <div className={cn('flex mx-auto gap-x-1.5 w-max mt-3', trackerClassName)}>
          {Array.from({ length: slidesCount }).map((_s, i) => (
            <button
              type="button"
              onClick={() => api?.scrollTo(i)}
              key={i}
              className={cn(
                'size-1.5 rounded-full cursor-pointer',
                i === activeSlideIndex ? 'bg-white' : 'bg-white/30',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
});
