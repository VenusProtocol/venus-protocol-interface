import { AnimatePresence, type HTMLMotionProps, motion } from 'framer-motion';
import { cn } from 'utilities';

export interface AccordionAnimatedContentProps extends HTMLMotionProps<'div'> {
  isOpen: boolean;
}

export const AccordionAnimatedContent: React.FC<AccordionAnimatedContentProps> = ({
  children,
  className,
  isOpen,
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
