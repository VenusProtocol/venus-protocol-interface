import { useState, Children } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from 'utilities';

const ANIMATION_BASE_DURATION_S = 0.75;

export const Carousel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const childrenArray = Children.toArray(children);

  return (
    <div
      className={cn(
        'relative overflow-hidden border-lightGrey border rounded-2xl bg-background',
        className,
      )}
      {...props}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={activeItemIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: ANIMATION_BASE_DURATION_S,
          }}
        >
          {childrenArray[activeItemIndex]}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-center space-x-2 absolute bottom-2 left-0 right-0">
        {childrenArray.map((_, index) => (
          <button
            type="button"
            className={cn(
              'w-3 h-3 rounded-full border bg-cards border-lightGrey hover:bg-lightGrey',
              index === activeItemIndex && 'bg-lightGrey',
            )}
            onClick={() => setActiveItemIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};
