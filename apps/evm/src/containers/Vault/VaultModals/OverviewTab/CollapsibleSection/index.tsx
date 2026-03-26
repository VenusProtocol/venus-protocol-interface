import { AccordionAnimatedContent, Icon } from 'components';
import { useState } from 'react';

interface CollapsibleSectionProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <div className="flex items-center justify-between w-full gap-3">
        <p className="text-p2s text-white flex-1">{title}</p>

        <button
          type="button"
          className="hidden md:block text-grey hover:text-white transition-colors"
          onClick={() => setIsOpen(prev => !prev)}
        >
          <Icon
            name="chevronDown"
            className={`size-4 transition-transform cursor-pointer ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <AccordionAnimatedContent isOpen={isOpen}>
        <div className="mt-4">{children}</div>
      </AccordionAnimatedContent>
    </div>
  );
};
