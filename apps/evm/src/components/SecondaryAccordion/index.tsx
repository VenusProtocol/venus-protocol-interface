import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from 'utilities';
import { Icon } from '../Icon';

export interface SecondaryAccordionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: string | React.ReactNode;
  rightLabel?: string | React.ReactNode;
}

export const SecondaryAccordion: React.FC<SecondaryAccordionProps> = ({
  children,
  title,
  rightLabel,
  ...otherProps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div {...otherProps}>
      <button
        className="flex items-center justify-between w-full h-6"
        type="button"
        onClick={toggle}
      >
        {!!title && <span className="text-grey">{title}</span>}

        <div className="ml-auto justify-self-end flex items-center gap-x-1">
          {!!rightLabel && <span>{rightLabel}</span>}

          <Icon name="arrowUp" className={cn('text-grey w-5 h-5', !isOpen && 'rotate-180')} />
        </div>
      </button>

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
            className="mt-2 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
