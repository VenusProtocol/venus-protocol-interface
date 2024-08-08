import { useState } from 'react';
import { cn } from 'utilities';
import { AccordionAnimatedContent } from '../AccordionAnimatedContent';
import { Icon } from '../Icon';

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: string | React.ReactNode;
  rightLabel?: string | React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({
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

      <AccordionAnimatedContent isOpen={isOpen}>
        <div className="pt-2">{children}</div>
      </AccordionAnimatedContent>
    </div>
  );
};
