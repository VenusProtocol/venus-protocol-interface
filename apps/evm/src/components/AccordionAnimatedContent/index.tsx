import { AnimatePresence, type HTMLMotionProps, motion } from 'motion/react';
import { cn } from 'utilities';

export interface AccordionAnimatedContentProps extends HTMLMotionProps<'div'> {
  isOpen: boolean;
}

export const AccordionAnimatedContent: React.FC<AccordionAnimatedContentProps> = ({
  children,
  className,
  isOpen,
  ref: _ref, // TODO: remove once we upgrade to React 19. Motion is currently complaining that the ref prop is incompatible
  ...otherProps
}) => (
  <AnimatePresence initial={isOpen}>
    {isOpen && (
      <motion.div
        key="content"
        initial="closed"
        animate="open"
        exit="closed"
        variants={{
          open: { height: 'auto' },
          closed: { height: 0 },
        }}
        transition={{ duration: 0.25 }}
        className={cn('overflow-hidden', className)}
        {...otherProps}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);
