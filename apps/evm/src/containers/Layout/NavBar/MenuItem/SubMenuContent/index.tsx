import { cn } from '@venusprotocol/ui';

import type { SubMenu } from '../../types';
import { SubMenuItem, type SubMenuItemProps } from './SubMenuItem';

export interface SubMenuContentProps extends Omit<SubMenu, 'items'> {
  items: SubMenuItemProps[];
}

export const SubMenuContent: React.FC<SubMenuContentProps> = ({ variant = 'primary', items }) => (
  <div
    className={cn(
      'rounded-lg',
      variant === 'primary' ? 'min-w-83' : 'py-3 bg-background-active min-w-137',
    )}
  >
    <div
      className={cn(
        variant === 'secondary' ? 'sm:grid sm:grid-cols-2 sm:gap-x-3 sm:max-w-137' : 'space-y-3',
      )}
    >
      {items.map(subItem => (
        <SubMenuItem {...subItem} variant={variant} key={subItem.label} />
      ))}
    </div>
  </div>
);
