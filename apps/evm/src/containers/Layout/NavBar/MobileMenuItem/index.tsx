import { cn } from '@venusprotocol/ui';

import { AccordionAnimatedContent, Icon } from 'components';
import { Link } from 'containers/Link';
import { useState } from 'react';
import { SubMenuItem } from '../SubMenuItem';
import type { MenuItem, SubMenu } from '../types';

export interface MobileMenuItemProps {
  item: MenuItem | SubMenu;
  onClick: () => void;
}

export const MobileMenuItem: React.FC<MobileMenuItemProps> = ({ item, onClick }) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const sharedContainerClassName =
    'block w-full text-left py-3 font-semibold text-light-grey hover:no-underline hover:text-light-grey-hover active:text-light-grey-active';

  // Toggle accordion's open state
  const onAccordionTriggerClick = () => setIsAccordionOpen(value => !value);

  return 'items' in item ? (
    <div>
      <button
        className={cn(sharedContainerClassName, 'flex items-center justify-between')}
        type="button"
        onClick={onAccordionTriggerClick}
      >
        <span>{item.label}</span>

        <Icon name="chevronDown" className={cn('size-3', isAccordionOpen && 'rotate-180')} />
      </button>

      <AccordionAnimatedContent isOpen={isAccordionOpen} className="pb-4">
        <div
          className={cn('rounded-lg', item.variant === 'secondary' && 'py-3 bg-background-active')}
        >
          <div
            className={cn(
              item.variant === 'secondary'
                ? 'sm:grid sm:grid-cols-2 sm:gap-x-3 sm:max-w-137'
                : 'space-y-3',
            )}
          >
            {item.items.map(subItem => (
              <SubMenuItem
                {...subItem}
                variant={item.variant}
                onClick={onClick}
                key={subItem.label}
              />
            ))}
          </div>
        </div>
      </AccordionAnimatedContent>
    </div>
  ) : (
    <Link to={item.to} href={item.href} onClick={onClick} className={sharedContainerClassName}>
      {item.label}
    </Link>
  );
};
