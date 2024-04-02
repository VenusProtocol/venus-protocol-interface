import { AnimatePresence, motion } from 'framer-motion';
import { Children, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cn } from 'utilities';

const ANIMATION_BASE_DURATION_S = 0.3;
const SLIDE_DURATION_MS = 3500;

export const Carousel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const childrenArray = useMemo(() => Children.toArray(children), [children]);

  const autoPlayInterval = useRef<ReturnType<typeof setInterval>>();
  const setAutoPlayInterval = useCallback(() => {
    autoPlayInterval.current = setInterval(
      () =>
        setActiveItemIndex(currentActiveItemIndex =>
          // Automatically reset active index to 0 if we've reached the end of the carousel
          currentActiveItemIndex >= childrenArray.length - 1 ? 0 : currentActiveItemIndex + 1,
        ),
      SLIDE_DURATION_MS,
    );
  }, [childrenArray]);

  // Start autoplay on mount
  useEffect(() => {
    setAutoPlayInterval();
    return () => clearInterval(autoPlayInterval.current);
  }, [setAutoPlayInterval]);

  const selectItem = (newActiveIndex: number) => {
    // Reset autoplay
    clearInterval(autoPlayInterval.current);
    // Update active index
    setActiveItemIndex(newActiveIndex);
    // Start autoplay again
    setAutoPlayInterval();
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden border-lightGrey border rounded-2xl bg-background min-h-[100px]',
        className,
      )}
      {...props}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {childrenArray.map((child, index) =>
          activeItemIndex === index ? (
            <motion.div
              key={activeItemIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: ANIMATION_BASE_DURATION_S,
              }}
            >
              {child}
            </motion.div>
          ) : undefined,
        )}
      </AnimatePresence>

      <div className="flex items-center justify-center space-x-2 absolute bottom-2 left-0 right-0">
        {childrenArray.map((_, index) => (
          <button
            key={index}
            type="button"
            className={cn(
              'w-3 h-3 rounded-full border bg-background border-lightGrey hover:bg-grey hover:border-grey',
              index === activeItemIndex && 'bg-grey border-grey',
            )}
            onClick={() => selectItem(index)}
          />
        ))}
      </div>
    </div>
  );
};
